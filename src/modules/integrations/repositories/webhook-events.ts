import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { IWebhookEventsRepository } from '../contracts/repositories/webhook-events';
import { WebhookEvent, WebhookEventProvider } from '../entities/webhook-event';

export class WebhookEventsRepository implements IWebhookEventsRepository {
  private ormRepository: Repository<WebhookEvent>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(WebhookEvent);
  }

  public async findByProviderAndEventId(
    provider: string,
    eventId: string,
  ): Promise<WebhookEvent | null> {
    return this.ormRepository.findOne({
      where: { provider: provider as WebhookEventProvider, eventId },
    });
  }

  public async create(data: Partial<WebhookEvent>): Promise<WebhookEvent> {
    const entity = this.ormRepository.create(data);
    return this.ormRepository.save(entity);
  }
}
