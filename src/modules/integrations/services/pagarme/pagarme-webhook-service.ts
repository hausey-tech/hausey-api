/* eslint-disable no-case-declarations */
import { container, injectable } from 'tsyringe';
import { UpdateSubscriptionByWebhookService } from 'modules/patients/services/update-subscription-by-webhook-service';
import { IPagarmeWebhookDTO } from '../../contracts/dtos/pagarme/pagarme-webhook-dto';

@injectable()
export class PagarmeWebhookService {
  public async execute(webhook: IPagarmeWebhookDTO): Promise<void> {
    const { type } = webhook;
    switch (type) {
      case 'order.paid':
        const updateSubscriptionByWebhookService = container.resolve(
          UpdateSubscriptionByWebhookService,
        );
        await updateSubscriptionByWebhookService.execute(webhook);
        break;

      default:
        break;
    }
  }
}
