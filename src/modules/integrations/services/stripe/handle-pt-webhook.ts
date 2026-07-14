import { container, injectable } from 'tsyringe';
import Stripe from 'stripe';
import { stripePTInstance } from '../../utils/stripe-instance';
import { UpdatePatientPlanService } from '../../../patients/services/update-patient-plan';
import { DetectAndApplyPlanChangeService } from '../../../patients/services/detect-and-apply-plan-change-service';
import { CreateTransfers } from './create-transfers';
import { RegisterWebhookEventService } from '../register-webhook-event-service';
import { DeactivateAllDependentsService } from '../../../dependents/services/deactivate-all-dependents';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { CreateErrorService } from '../../../errors/service/create-error-service';
import { brevo } from '../../../../shared/utils/brevo';

interface Props {
  sig: string | string[];
  body: any;
}

@injectable()
export class HandlePtWebhook {
  public async execute({ sig, body }: Props): Promise<void> {
    const event = await stripePTInstance.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_PT_ENDPOINT_SECRET,
    );

    const registerWebhookEventService = container.resolve(
      RegisterWebhookEventService,
    );
    const isNewEvent = await registerWebhookEventService.execute({
      provider: 'stripe',
      eventId: event.id,
      eventType: event.type,
    });

    if (!isNewEvent) {
      return;
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.paid) {
        const periodEnd = invoice.lines.data[0].period.end;
        const priceId = invoice.lines.data[0].price.id;
        const customerId = invoice.customer;

        const updatePatientPlan = container.resolve(UpdatePatientPlanService);
        await updatePatientPlan.execute({
          periodEnd,
          priceId,
          customerId: customerId as string,
        });

        const createTransfers = container.resolve(CreateTransfers);
        await createTransfers.execute({
          customerId: customerId as string,
          amount: invoice.amount_paid,
          chargeId: invoice.charge as string,
        });
      }
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const customerId = subscription.customer as string;

      const detectAndApplyPlanChangeService = container.resolve(
        DetectAndApplyPlanChangeService,
      );
      await detectAndApplyPlanChangeService.execute({ customerId, priceId });
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const patientsRepository =
        container.resolve<IPatientsRepository>('PatientsRepository');
      const patient = await patientsRepository.findByCustomerId(customerId);

      if (patient) {
        await patientsRepository.update(patient.id, {
          isPro: false,
          planExpiresAt: null,
        });

        const deactivateAllDependentsService = container.resolve(
          DeactivateAllDependentsService,
        );
        await deactivateAllDependentsService.execute({ holderId: patient.id });
      }
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const createErrorService = container.resolve(CreateErrorService);
      await createErrorService.execute({
        statusCode: 402,
        message: `Falha no pagamento da fatura Stripe. CustomerId: ${customerId}, InvoiceId: ${invoice.id}`,
      });

      brevo({
        to: 'adm.hausey@gmail.com',
        subject: `⚠️ Falha de pagamento - Stripe`,
        body: `
        <h2>Falha no pagamento de uma fatura Stripe</h2>
        <p>Cliente: <b>${customerId}</b></p>
        <p>Invoice: <b>${invoice.id}</b></p>
        <p>Nenhuma ação foi tomada — aguardando novas tentativas do Stripe (dunning) ou um evento de cancelamento.</p>
      `,
      });
    }
  }
}
