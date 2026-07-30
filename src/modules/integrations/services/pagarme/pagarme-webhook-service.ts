/* eslint-disable no-case-declarations */
import { container, injectable } from 'tsyringe';
import { UpdateSubscriptionByWebhookService } from '../../../patients/services/update-subscription-by-webhook-service';
import { IPagarmeWebhookDTO } from '../../contracts/dtos/pagarme/pagarme-webhook-dto';
import { RegisterWebhookEventService } from '../register-webhook-event-service';

@injectable()
export class PagarmeWebhookService {
  public async execute(webhook: IPagarmeWebhookDTO): Promise<void> {
    const { type, id } = webhook;

    const registerWebhookEventService = container.resolve(
      RegisterWebhookEventService,
    );
    const isNewEvent = await registerWebhookEventService.execute({
      provider: 'pagarme',
      eventId: id,
      eventType: type,
    });

    if (!isNewEvent) {
      return;
    }

    const updateSubscriptionByWebhookService = container.resolve(
      UpdateSubscriptionByWebhookService,
    );
    switch (type) {
      case 'order.paid':
      case 'invoice.paid':
        await updateSubscriptionByWebhookService.execute(webhook);
        break;

      default:
        break;
    }
  }
}
