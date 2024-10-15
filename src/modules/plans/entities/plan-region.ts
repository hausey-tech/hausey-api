import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Plan } from './plan';

@Entity('plan_regions')
export class PlanRegion extends BaseEntity {
  @Column('varchar')
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn()
  plan: string;

  @Column('varchar')
  region: string;
}
