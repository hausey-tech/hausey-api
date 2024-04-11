import { injectable, inject, container } from 'tsyringe';
import { CreatePagarmeSubscriptionService } from '../../integrations/services/pagarme/create-pagarme-subscription-service';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';

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
    const plan = await this.plansRepository.findyByPriceId(planId);
    if (!plan.stripePriceId) {
      throw new AppError(
        'Plano não encontrado, entre em contato com o suporte!',
      );
    }
    const split = [];
    const discounts = [];
    if (patient.sellerId) {
      let { price } = plan;
      const sellerCode = await this.sellerCodesRepository.findBySellerId(
        patient.sellerId,
      );
      if (sellerCode.discount) {
        price = plan.price - sellerCode.discount;
        discounts.push({
          discountType: 'flat',
          value: sellerCode.discount,
        });
      }
      if (plan.sellerPart && patient.seller.recipientId) {
        split.push({
          amount: plan.sellerPart,
          recipientId: patient.seller.recipientId,
          type: 'flat',
          options: {
            chargeProcessingFee: false,
            chargeRemainderFee: false,
            liable: false,
          },
        });
        split.push({
          amount: price - plan.sellerPart,
          recipientId: process.env.PAGARME_RECIPIENT_ID,
          type: 'flat',
          options: {
            chargeProcessingFee: true,
            chargeRemainderFee: true,
            liable: true,
          },
        });
      }
    }
    const createPagarmeSubscriptionService = container.resolve(
      CreatePagarmeSubscriptionService,
    );
    const expiresAt = await createPagarmeSubscriptionService.execute({
      planId,
      paymentMethod,
      cardToken,
      customerId: patient.stripeCustomerId,
      split,
      discounts,
      address,
    });

    await this.patientsRepository.update(patient.id, {
      planId: plan.id,
      planExpiresAt: expiresAt,
    });
  }
}
