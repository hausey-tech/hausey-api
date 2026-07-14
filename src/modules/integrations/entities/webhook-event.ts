import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

export type WebhookEventProvider = 'stripe' | 'pagarme';

@Entity('webhook_events')
export class WebhookEvent extends BaseEntity {
  @Column('varchar')
  provider: WebhookEventProvider;

  @Column('varchar', { name: 'event_id' })
  eventId: string;

  @Column('varchar', { name: 'event_type' })
  eventType: string;

  @Column('timestamp', { name: 'processed_at' })
  processedAt: Date;
}
