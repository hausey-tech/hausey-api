import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { Patient } from '../../patients/entities/patient';
import { Specialty } from '../../professionals/entities/specialty';
import { Professional } from '../../professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Anamnesis } from './anamnesis';
import { PrimaryDiagnosis } from './primary-diagnosis';

@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column('timestamp')
  date: Date;

  @Column('varchar', { name: 'specialty_id' })
  specialtyId: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @Column('varchar', { name: 'professional_id', nullable: true })
  professionalId: string;

  @ManyToOne(() => Professional, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'anamnesis_id', nullable: true })
  anamnesisId: string;

  @OneToOne(() => Anamnesis)
  @JoinColumn({ name: 'anamnesis_id' })
  anamnesis: Anamnesis;

  @Column('varchar', { name: 'primary_diagnosis_id', nullable: true })
  primaryDiagnosisId: string;

  @OneToOne(() => PrimaryDiagnosis)
  @JoinColumn({ name: 'primary_diagnosis_id' })
  primaryDiagnosis: PrimaryDiagnosis;

  @Column('boolean', { nullable: true })
  paid: boolean;
}
