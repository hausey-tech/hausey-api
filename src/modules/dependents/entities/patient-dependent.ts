import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Patient } from '../../patients/entities/patient';

export type DependentStatus = 'pending' | 'active' | 'removed';

@Entity('patient_dependents')
export class PatientDependent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'holder_id' })
  holderId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'holder_id' })
  holder: Patient;

  @Column('uuid', { name: 'dependent_patient_id', nullable: true })
  dependentPatientId: string | null;

  @ManyToOne(() => Patient, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'dependent_patient_id' })
  dependentPatient: Patient | null;

  @Column('boolean', { name: 'has_app_access', default: false })
  hasAppAccess: boolean;

  @Column('varchar', { nullable: true })
  name: string | null;

  @Column('varchar', { nullable: true })
  birthdate: string | null;

  @Column('varchar', { nullable: true })
  cpf: string | null;

  @Column('varchar', { nullable: true })
  email: string | null;

  @Column('varchar', { name: 'invite_token', nullable: true })
  inviteToken: string | null;

  @Column('timestamp', { name: 'invite_expires_at', nullable: true })
  inviteExpiresAt: Date | null;

  @Column('varchar', { length: 15, default: 'pending' })
  status: DependentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
