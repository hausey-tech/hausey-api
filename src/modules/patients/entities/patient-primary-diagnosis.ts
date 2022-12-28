import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from './patient';
import { Appointment } from '../../appointments/entities/appointment';

@Entity('patient_primary_diagnoses')
export class PatientPrimaryDiagnosis extends BaseEntity {
  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'appointment_id' })
  appointmentId: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column('varchar')
  description: string;
}
