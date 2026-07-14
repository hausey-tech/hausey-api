import { WebhookEvent } from '../../entities/webhook-event';

export interface IWebhookEventsRepository {
  findByProviderAndEventId(
    provider: string,
    eventId: string,
  ): Promise<WebhookEvent | null>;
  create(data: Partial<WebhookEvent>): Promise<WebhookEvent>;
}
