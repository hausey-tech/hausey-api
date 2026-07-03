import { inject, injectable } from 'tsyringe';
import { QueryFailedError } from 'typeorm';
import { IWebhookEventsRepository } from '../contracts/repositories/webhook-events';
import { WebhookEventProvider } from '../entities/webhook-event';

interface Props {
  provider: WebhookEventProvider;
  eventId: string;
  eventType: string;
}

@injectable()
export class RegisterWebhookEventService {
  constructor(
    @inject('WebhookEventsRepository')
    private webhookEventsRepository: IWebhookEventsRepository,
  ) {}

  public async execute({
    provider,
    eventId,
    eventType,
  }: Props): Promise<boolean> {
    try {
      await this.webhookEventsRepository.create({
        provider,
        eventId,
        eventType,
        processedAt: new Date(),
      });

      return true;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        return false;
      }

      throw error;
    }
  }
}
