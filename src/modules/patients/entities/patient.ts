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
import { User } from '../../users/entities/user';
import { PatientGroup } from './patient-group';
import { PatientProfessionalAssistance } from './patient-professional-assistance';
import { Team } from '../../teams/entities/team-entity';

@Entity('patients')
export class Patient extends UserEntity {
  @Column('varchar', { name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => ClinicalResume, clinicalResume => clinicalResume.patient)
  clinicalResume: ClinicalResume[];

  @OneToMany(() => PatientGroup, patientGroup => patientGroup.patient)
  patientGroups: PatientGroup[];

  @OneToMany(
    () => PatientProfessionalAssistance,
    patientProfessionalAssistance => patientProfessionalAssistance.patient,
  )
  patientProfessionalAssistances: PatientProfessionalAssistance[];

  @OneToOne(() => Address, address => address.patient)
  address: Address;

  @Column('varchar', { name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @Column('timestamp', { name: 'plan_expires_at', nullable: true })
  planExpiresAt: Date;

  @Column('varchar', { name: 'seller_id', nullable: true })
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column('varchar', { nullable: true })
  questionnaireUrl: string | null;

  @Column('varchar', { nullable: true })
  fcmToken: string | null;

  @Column('varchar', { nullable: true })
  responsibleTeamId: string | null;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn()
  responsibleTeam: Team | null;
}
