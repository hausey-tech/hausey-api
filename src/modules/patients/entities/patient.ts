import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Address } from '../../addresses/entities/Address';
import { Plan } from '../../plans/entities/plan';
import { ClinicalResume } from '../../clinical-resumes/entities/clinical-resume';

@Entity('patients')
export class Patient extends UserEntity {
  @Column('varchar', { name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column('varchar', { name: 'clinical_resume_id', nullable: true })
  clinicalResumeId: string;

  @OneToMany(() => ClinicalResume, clinicalResume => clinicalResume.patient)
  @JoinColumn({ name: 'clinical_resume_id' })
  clinicalResume: ClinicalResume;

  @OneToOne(() => Address, address => address.patient)
  address: Address;

  @Column('varchar', { name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @Column('timestamp', { name: 'plan_expires_at', nullable: true })
  planExpiresAt: Date;
}
