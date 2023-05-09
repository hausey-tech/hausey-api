import { container, injectable } from 'tsyringe';
import Stripe from 'stripe';
import { stripeInstance } from '../../utils/stripe-instance';
import { UpdatePatientPlanService } from '../../../patients/services/update-patient-plan';

interface Props {
  sig: string | string[];
  body: any;
}

@injectable()
export class HandleWebhook {
  public async execute({ sig, body }: Props): Promise<void> {
    const event = await stripeInstance.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET,
    );

    if (event.type === 'invoice.updated') {
      const invoice = event.data.object as Stripe.Invoice;

      if (invoice.paid) {
        const periodEnd = invoice.lines.data[0].period.end;
        const priceId = invoice.lines.data[0].price.id;
        const customerId = invoice.customer;

        // foi pago atualiza paciente
        const updatePatientPlan = container.resolve(UpdatePatientPlanService);
        updatePatientPlan.execute({
          periodEnd,
          priceId,
          customerId: customerId as string,
        });
        console.log(
          'Entrou no webhook e atualizou os dados: ',
          periodEnd,
          priceId,
          customerId,
        );
      } else {
        // envia email avisando paciente que pagamento foi negado
      }
    }
  }
}
