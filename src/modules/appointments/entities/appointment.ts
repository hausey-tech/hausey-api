import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { Patient } from '../../patients/entities/patient';
import { Specialty } from '../../specialties/entities/specialty';
import { Professional } from '../../professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Prescription } from '../../prescriptions/entities/prescription';

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

  @Column('varchar', { nullable: true })
  anamnesis: string;

  @Column('varchar', { name: 'primary_diagnosis', nullable: true })
  primaryDiagnosis: string;

  @Column('boolean', { nullable: true })
  paid: boolean;

  @OneToMany(() => Prescription, prescription => prescription.appointment)
  prescriptions: Prescription[];
}
