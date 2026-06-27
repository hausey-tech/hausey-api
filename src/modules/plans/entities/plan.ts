import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { PlanRegion } from './plan-region';

export type PlanType = 'individual' | 'family';

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

  @Column('varchar', { length: 20, default: 'individual' })
  type: PlanType;

  @Column('int', { name: 'max_dependents', default: 0 })
  maxDependents: number;

  @Column('boolean', { name: 'is_pro', default: false })
  isPro: boolean;

  @OneToMany(() => PlanRegion, planRegion => planRegion.plan)
  regions: PlanRegion[];
}
