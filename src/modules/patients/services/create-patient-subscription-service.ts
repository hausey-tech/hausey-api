import { injectable, inject, container } from 'tsyringe';
import { CreatePagarmeSubscriptionService } from '../../integrations/services/pagarme/create-pagarme-subscription-service';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';

interface IProps {
  patientId: string;
  planId: string;
  paymentMethod: number;
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
export class CreatePatientSubscriptionService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
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
    const split = [];
    const discounts = [];
    if (patient.sellerId) {
      const sellerCode = await this.sellerCodesRepository.findBySellerId(
        patient.sellerId,
      );
      if (sellerCode.discount) {
        discounts.push({
          discountType: 'percentage',
          value: sellerCode.discount,
        });
      }
      if (sellerCode.fee && patient.seller.recipientId) {
        split.push({
          amount: sellerCode.fee,
          recipientId: patient.seller.recipientId,
          type: 'porcentage',
          options: {
            chargeProcessingFee: false,
            chargeRemainderFee: false,
            liable: false,
          },
        });
        split.push({
          amount: 100 - sellerCode.fee,
          recipientId: process.env.PAGARME_RECIPIENT_ID,
          type: 'porcentage',
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
    patient.planExpiresAt = new Date(expiresAt);
    await this.patientsRepository.save(patient);
  }
}
