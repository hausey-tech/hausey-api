import { container, injectable } from 'tsyringe';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { CreateErrorService } from '../../../errors/service/create-error-service';

interface IProps {
  customerId: string;
}

@injectable()
export class CancelPagarmeCustomerSubscriptionsService {
  public async execute({ customerId }: IProps): Promise<void> {
    try {
      const { data } = await pagarmeInstance.get(
        `/subscriptions?customer_id=${customerId}&status=active&size=100`,
      );
      if (data?.data) {
        await Promise.all(
          data.data.map(async subscription => {
            await pagarmeInstance.delete(`/subscriptions/${subscription.id}`, {
              data: {
                cancel_pending_invoices: true,
              },
            });
          }),
        );
      }
    } catch (error) {
      const createErrorService = container.resolve(CreateErrorService);
      createErrorService.execute({
        statusCode: 500,
        message: `Erro ao cancelar assinatura na pagar.me\nCustomerId:${customerId}`,
      });
    }
  }
}
