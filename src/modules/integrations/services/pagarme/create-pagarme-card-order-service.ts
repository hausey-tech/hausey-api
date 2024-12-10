import { inject, injectable } from 'tsyringe';
import { ICreatePagarmeCardOrderDTO } from 'modules/integrations/contracts/dtos/create-pagarme-card-order-dto';
import { Logger } from 'pino';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';

export interface IPix {
  qrCode: string;
  expiresAt: string;
}

@injectable()
export class CreatePagarmeCardOrderService {
  constructor(
    @inject('Logger')
    private readonly logger: Logger,
  ) {}

  public async execute({
    customerId,
    plan,
    price,
    months,
    split,
    creditCard,
  }: ICreatePagarmeCardOrderDTO): Promise<string> {
    try {
      const { data } = await pagarmeInstance.post('/orders', {
        customer_id: customerId,
        items: [
          {
            amount: price,
            description: `Plano ${plan.id}`,
            quantity: months,
            code: plan.id,
          },
        ],
        payments: [
          {
            payment_method: 'credit_card',
            amount: price,
            credit_card: {
              installments: creditCard.installments,
              card_token: creditCard.cardToken,
              statement_descriptor: `Plano Hausey`,
            },
            split:
              split?.length > 0 &&
              !(process.env.PAGARME_SECRET_KEY.split('_')[1] === 'test')
                ? split.map(sp => ({
                    amount: sp.amount,
                    recipient_id: sp.recipientId,
                    type: sp.type,
                    options: {
                      charge_processing_fee: sp.options.chargeProcessingFee,
                      charge_remainder_fee: sp.options.chargeRemainderFee,
                      liable: sp.options.liable,
                    },
                  }))
                : undefined,
          },
        ],
      });
      if (data.status !== 'active') {
        this.logger.info(
          {
            status: data.status,
            data,
          },
          'Não foi possível realizar a assinatura.',
        );
        throw new AppError('FAILED');
      }
      this.logger.info(
        {
          data,
        },
        'Assinatura realizada com sucesso.',
      );
      return data.current_cycle.end_at;
    } catch (error) {
      console.error(error.response.data);
      this.logger.info(
        {
          error,
        },
        'Erro ao criar o pedido, tente novamente mais tarde.',
      );
      throw new AppError('Erro ao criar pedido, tente novamente mais tarde!');
    }
  }
}
