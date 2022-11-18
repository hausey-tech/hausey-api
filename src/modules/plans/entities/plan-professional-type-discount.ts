import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { ProfessionalType } from '../../professionals/entities/professional-type';
import { Plan } from './plan';

@Entity('plan_professional_type_discounts')
export class PlanProfessionalTypeDiscount extends BaseEntity {
  @Column('varchar', { name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: string;

  @Column('varchar', { name: 'professional_type_id' })
  professionalTypeId: string;

  @ManyToOne(() => ProfessionalType)
  @JoinColumn({ name: 'professional_type_id' })
  professionalType: ProfessionalType;

  @Column('int')
  discount: number;
}
