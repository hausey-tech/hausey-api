import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Plan } from '../../plans/entities/plan';

@Entity('patients')
export class Patient extends UserEntity {
  @Column('varchar', { name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
