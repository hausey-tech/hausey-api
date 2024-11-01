import Stripe from 'stripe';
import { container, inject, injectable } from 'tsyringe';
import { stripeInstance } from '../../utils/stripe-instance';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { ISellerCodesRepository } from '../../../seller-codes/contracts/repositories/seller-codes';
import { CreateErrorService } from '../../../errors/service/create-error-service';

interface Props {
  customerId: string;
  amount: number;
}

@injectable()
export class CreateTransfers {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute({ customerId, amount }: Props): Promise<void> {
    const patient = await this.patientsRepository.findByCustomerId(customerId);
    if (!patient || !patient.sellerId) {
      return;
    }

    const sellerCode = await this.sellerCodesRepository.findBySellerId(
      patient.sellerId,
    );

    const createErrorService = container.resolve(CreateErrorService);
    if (!sellerCode) {
      await createErrorService.execute({
        userId: patient.id,
        statusCode: 500,
        message:
          'CreateTransfers: Representante vinculado ao paciente não possui código de desconto',
      });
      return;
    }

    try {
      const transfers: Stripe.TransferCreateParams[] = [];

      const date = new Date().toISOString().split('T')[0];
      const transferGroup = `${date}:${patient.id}`;

      const ownerFee = sellerCode.fee / 100;
      if (ownerFee > 0 && ownerFee < 1) {
        transfers.push({
          amount: Math.floor(ownerFee * amount),
          currency: 'usd',
          destination: sellerCode.seller.recipientId,
          transfer_group: transferGroup,
        });
      }

      sellerCode.sellers.forEach(seller => {
        const sellerFee = seller.fee / 100;
        if (sellerFee > 0 && sellerFee < 1) {
          transfers.push({
            amount: Math.floor(sellerFee * amount),
            currency: 'usd',
            destination: seller.seller.recipientId,
            transfer_group: transferGroup,
          });
        }
      });

      await Promise.all(
        transfers.map(async transfer => {
          await stripeInstance.transfers.create(transfer);
        }),
      );
    } catch (error) {
      await createErrorService.execute({
        userId: patient.id,
        statusCode: 500,
        message: `CreateTransfers: ${error}`,
      });
    }
  }
}
