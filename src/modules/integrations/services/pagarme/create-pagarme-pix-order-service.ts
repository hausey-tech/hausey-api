import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { ICreatePagarmePixOrderDTO } from '../../contracts/dtos/create-pagarme-pix-order-dto';
import { pagarmeInstance } from '../../utils/pagarme-instance';

export interface IPix {
  qrCode: string;
  expiresAt: string;
}

@injectable()
export class CreatePagarmePixOrderService {
  public async execute({
    customerId,
    plan,
    price,
    months,
    split,
    handleAmount,
  }: ICreatePagarmePixOrderDTO): Promise<IPix> {
    try {
      console.log('NO ORDER =>', handleAmount);
      console.log('amount:', { amount: handleAmount });
      console.log('Console de split', split);
      split.map(sp => console.log('sp.amount', sp.amount));
      const { data } = await pagarmeInstance.post('/orders', {
        customer_id: customerId,
        items: [
          {
            amount: handleAmount ?? price,
            description: `Plano ${plan.id}`,
            quantity: months,
            code: plan.id,
          },
        ],
        payments: [
          {
            split:
              split?.length > 0 &&
              !(process.env.PAGARME_SECRET_KEY.split('_')[1] === 'test')
                ? split.map(sp => ({
                    amount: handleAmount ?? sp.amount,
                    recipient_id: sp.recipientId,
                    type: sp.type,
                    options: {
                      charge_processing_fee: sp.options.chargeProcessingFee,
                      charge_remainder_fee: sp.options.chargeRemainderFee,
                      liable: sp.options.liable,
                    },
                  }))
                : undefined,
            payment_method: 'pix',
            pix: {
              expires_in: '300',
              additional_information: [
                {
                  name: `Plano`,
                  value: plan.name,
                },
              ],
            },
          },
        ],
      });
      return {
        qrCode: data.charges[0].last_transaction?.qr_code,
        expiresAt: data.charges[0].last_transaction?.expires_at,
      };
    } catch (error) {
      console.error('error stripe: ', error.response.data);
      throw new AppError('Erro ao criar pedido, tente novamente mais tarde!');
    }
  }
}
