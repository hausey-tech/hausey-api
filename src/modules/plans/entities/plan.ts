import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { PlanRegion } from './plan-region';

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

  @Column('int', { nullable: true })
  sellerPart: number | null;

  @Column('boolean', { name: 'is_pro', default: false })
  isPro: boolean;

  @Column('varchar', { nullable: true })
  type: 'Individual' | 'Familiar' | null;

  @OneToMany(() => PlanRegion, planRegion => planRegion.plan)
  regions: PlanRegion[];
}
