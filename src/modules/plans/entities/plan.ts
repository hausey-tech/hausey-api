import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('plans')
export class Plan extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int')
  price: number;

  @Column('varchar', { name: 'stripe_price_id', nullable: true })
  stripePriceId: string;
}
