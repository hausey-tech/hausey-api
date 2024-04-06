import { injectable, inject, container } from 'tsyringe';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import {
  CreatePagarmePixOrderService,
  IPix,
} from '../../integrations/services/pagarme/create-pagarme-pix-order-service';

interface IProps {
  patientId: string;
  planId: string;
}

@injectable()
export class CreatePatientPixSubscriptionService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ patientId, planId }: IProps): Promise<IPix> {
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
    let { price } = plan;

    if (patient.sellerId) {
      const sellerCode = await this.sellerCodesRepository.findBySellerId(
        patient.sellerId,
      );
      if (sellerCode.discount) {
        price = plan.price - plan.price * (sellerCode.discount / 100);
      }
      if (sellerCode.fee && patient.seller.recipientId) {
        split.push({
          amount: sellerCode.fee,
          recipientId: patient.seller.recipientId,
          type: 'percentage',
          options: {
            chargeProcessingFee: false,
            chargeRemainderFee: false,
            liable: false,
          },
        });
        split.push({
          amount: 100 - sellerCode.fee,
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

    const createPagarmePixOrderService = container.resolve(
      CreatePagarmePixOrderService,
    );
    const pix = await createPagarmePixOrderService.execute({
      customerId: patient.stripeCustomerId,
      plan,
      price,
      split,
    });

    return pix;
  }
}
