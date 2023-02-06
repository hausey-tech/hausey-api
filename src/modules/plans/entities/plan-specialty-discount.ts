import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Specialty } from '../../specialties/entities/specialty';
import { Plan } from './plan';

@Entity('plan_specialty_discounts')
export class PlanSpecialtyDiscount extends BaseEntity {
  @Column('varchar', { name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: string;

  @Column('varchar', { name: 'specialty_id' })
  specialtyId: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @Column('int')
  discount: number;
}
