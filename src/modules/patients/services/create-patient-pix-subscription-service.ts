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
  months: number;
  handleAmount: number;
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

  public async execute({
    patientId,
    planId,
    months,
    handleAmount,
  }: IProps): Promise<IPix> {
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
      const sellerCodeDiscount = sellerCode.discounts.find(
        d => d.planId === plan.id,
      );
      if (sellerCodeDiscount) {
        price -= sellerCodeDiscount.discount;
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
          amount: handleAmount ?? sellerCodeSeller.fee,
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
          amount: handleAmount ?? sellerCode.fee,
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
          amount: handleAmount ?? 100 - sellersPart,
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
      months,
      split,
      handleAmount,
    });

    return pix;
  }
}
