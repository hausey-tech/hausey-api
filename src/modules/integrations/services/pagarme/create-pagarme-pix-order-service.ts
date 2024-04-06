import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { ICreatePagarmePixOrderDTO } from '../../contracts/dtos/create-pagarme-pix-order-dto';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { IPagarmeChargeDTO } from '../../contracts/dtos/pagarme/pagarme-charge-dto';

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
    split,
  }: ICreatePagarmePixOrderDTO): Promise<IPix> {
    try {
      const { data }: { data: IPagarmeChargeDTO } = await pagarmeInstance.post(
        '/orders',
        {
          customer_id: customerId,
          items: [
            {
              amount: price,
              description: `Plano ${plan.id}`,
              quantity: 1,
              code: plan.id,
            },
          ],
          payments: [
            {
              split,
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
        },
      );
      return {
        qrCode: data.last_transaction.qr_code,
        expiresAt: data.last_transaction.expires_at,
      };
    } catch (error) {
      console.error(error.response.data);
      throw new AppError('Erro ao criar pedido, tente novamente mais tarde!');
    }
  }
}
