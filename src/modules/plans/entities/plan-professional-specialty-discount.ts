import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { ProfessionalSpecialty } from '../../professionals/entities/professional-specialty';
import { Plan } from './plan';

@Entity('plan_professional_specialty_discounts')
export class PlanProfessionalSpecialtyDiscount extends BaseEntity {
  @Column('varchar', { name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: string;

  @Column('varchar', { name: 'professional_specialty_id' })
  professionalSpecialtyId: string;

  @ManyToOne(() => ProfessionalSpecialty)
  @JoinColumn({ name: 'professional_specialty_id' })
  professionalSpecialty: ProfessionalSpecialty;

  @Column('int')
  discount: number;
}
