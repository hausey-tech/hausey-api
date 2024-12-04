import { injectable } from 'tsyringe';
import { AppError } from 'shared/errors/app-error';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { ResponsePagarmeSubscription } from '../dtos/response-pagarme-getSubscriptionByCustomerId.dto';

@injectable()
export class GetCustomerInfoPagarmeService {
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
