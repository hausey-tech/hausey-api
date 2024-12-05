import { inject, injectable } from 'tsyringe';
import { Logger } from 'pino';
import { AppError } from '../../../../shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { ResponsePagarmeSubscription } from '../dtos/response-pagarme-getSubscriptionByCustomerId.dto';

@injectable()
export class GetCustomerInfoPagarmeService {
  constructor(
    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(
    customerId: string,
  ): Promise<ResponsePagarmeSubscription> {
    try {
      const data: ResponsePagarmeSubscription = await pagarmeInstance.get(
        '/subscriptions',
        {
          params: {
            customer_id: customerId,
          },
        },
      );
      this.logger.info(
        {
          data,
          customerId,
        },
        'Este é o retorno da PAGARME',
      );
      return data;
    } catch (error) {
      throw new AppError(
        error?.message === 'FAILED'
          ? 'Ocorreu um erro ao capturar a assinatura deste usuário, tente novamente ou entre em contato com o suporte para obter mais detalhes!'
          : `Erro ao capturar as informações: ${
              error?.response?.data?.message as string
            }`,
      );
    }
  }
}
