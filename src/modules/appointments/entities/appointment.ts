import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { Patient } from '../../patients/entities/patient';
import { ProfessionalType } from '../../professionals/entities/professional-type';
import { ProfessionalSpecialty } from '../../professionals/entities/professional-specialty';
import { Professional } from '../../professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Anamnesis } from './anamnesis';
import { PrimaryDiagnosis } from './primary-diagnosis';

@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column('varchar', { name: 'professional_type_id', nullable: true })
  professionalTypeId: string;

  @ManyToOne(() => ProfessionalType)
  @JoinColumn({ name: 'professional_type_id' })
  professionalType: ProfessionalType;

  @Column('varchar', { name: 'professional_specialty_id', nullable: true })
  professionalSpecialtyId: string;

  @ManyToOne(() => ProfessionalSpecialty)
  @JoinColumn({ name: 'professional_specialty_id' })
  professionalSpecialty: ProfessionalSpecialty;

  @Column('varchar', { name: 'professional_id', nullable: true })
  professionalId: string;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // @Column('varchar', { name: 'manager_id' })
  // managerId: string;

  @Column('timestamp')
  date: Date;

  // @Column('int', { name: 'payment_id' })
  // paymentId: number;

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
}
