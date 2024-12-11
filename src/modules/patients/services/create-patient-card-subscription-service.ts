import { injectable, inject, container } from 'tsyringe';
import { isBefore } from 'date-fns';
import { Logger } from 'pino';
import { CreatePagarmeCardOrderService } from '../../integrations/services/pagarme/create-pagarme-card-order-service';
import { CreatePagarmeSubscriptionService } from '../../integrations/services/pagarme/create-pagarme-subscription-service';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { CancelPagarmeCustomerSubscriptionsService } from '../../integrations/services/pagarme/cancel-pagarme-customer-subscriptions-service';

interface IProps {
  patientId: string;
  planId: string;
  paymentMethod: string;
  cardToken: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };
}

@injectable()
export class CreatePatientCardSubscriptionService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute({
    patientId,
    planId,
    paymentMethod,
    cardToken,
    address,
  }: IProps): Promise<void> {
    const patient = await this.patientsRepository.findById(patientId);
    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }
    if (!patient.stripeCustomerId) {
      throw new AppError(
        'Paciente não possui conta de pagamento, entre em contato com o suporte!',
      );
    }
    if (patient.planExpiresAt && isBefore(new Date(), patient.planExpiresAt)) {
      throw new AppError('Paciente já possui assinatura vigente!');
    }
    const plan = await this.plansRepository.findyByPriceId(planId);
    if (!plan.stripePriceId) {
      throw new AppError(
        'Plano não encontrado, entre em contato com o suporte!',
      );
    }
    const split = [];
    const discounts = [];
    let { price } = plan;
    if (patient.sellerId) {
      const sellerCode = await this.sellerCodesRepository.findBySellerId(
        patient.sellerId,
      );
      const sellerCodeDiscount = sellerCode.discounts.find(
        d => d.planId === plan.id,
      );
      if (sellerCodeDiscount) {
        price -= sellerCodeDiscount.discount;
        discounts.push({
          discountType: 'flat',
          value: sellerCodeDiscount.discount,
        });
      }
      let sellersPart = 0;
      sellerCode.sellers.forEach(sellerCodeSeller => {
        if (!sellerCodeSeller.seller.recipientId) {
          throw new AppError(
            'Há um problema com seu cupom, entre em contato com o suporte!',
          );
        }
        sellersPart += sellerCodeSeller.fee;
        split.push({
          amount: sellerCodeSeller.fee,
          recipientId: sellerCodeSeller.seller.recipientId,
          type: 'percentage',
          options: {
            chargeProcessingFee: false,
            chargeRemainderFee: false,
            liable: false,
          },
        });
      });

      if (sellerCode.fee && sellerCode.fee > 0) {
        if (!sellerCode.seller.recipientId) {
          throw new AppError(
            'Há um problema com seu código de desconto, entre em contato com o suporte!',
          );
        }
        sellersPart += sellerCode.fee;
        split.push({
          amount: sellerCode.fee,
          recipientId: sellerCode.seller.recipientId,
          type: 'percentage',
          options: {
            chargeProcessingFee: false,
            chargeRemainderFee: false,
            liable: false,
          },
        });
      }

      if (sellersPart > 0) {
        split.push({
          amount: 100 - sellersPart,
          recipientId: process.env.PAGARME_RECIPIENT_ID,
          type: 'percentage',
          options: {
            chargeProcessingFee: true,
            chargeRemainderFee: true,
            liable: true,
          },
        });
      }
    }

    const cancelPagarmeCustomerSubscriptionsService = container.resolve(
      CancelPagarmeCustomerSubscriptionsService,
    );

    await cancelPagarmeCustomerSubscriptionsService.execute({
      customerId: patient.stripeCustomerId,
    });

    const createPagarmeSubscriptionService = container.resolve(
      CreatePagarmeSubscriptionService,
    );

    const createPagarmeCardOrderService = container.resolve(
      CreatePagarmeCardOrderService,
    );

    if (patient.firstPayment) {
      const result = await createPagarmeCardOrderService.execute({
        customerId: patient.stripeCustomerId,
        months: 6,
        plan,
        split,
        price,
        address,
        creditCard: {
          cardToken,
          installments: 6,
          statement_descriptor: `${plan.name} - ${plan.description}`,
        },
      });
      this.logger.info(
        {
          data: result,
        },
        'Resultado do result',
      );
      await this.patientsRepository.update(patient.id, {
        planId: plan.id,
        firstPayment: false,
        planExpiresAt: result,
      });
    } else {
      const result = await createPagarmeSubscriptionService.execute({
        planId,
        paymentMethod,
        cardToken,
        customerId: patient.stripeCustomerId,
        split,
        discounts,
        address,
        intervalCount: 1,
      });
      await this.patientsRepository.update(patient.id, {
        planId: plan.id,
        firstPayment: false,
        planExpiresAt: result,
      });
    }
  }
}
