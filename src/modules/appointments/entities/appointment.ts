import { Entity, Column, Timestamp, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities';
import { Professional } from '../../professionals/entities';

import { BaseEntity } from '../../../shared/typeorm/entities';

@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column('varchar', { name: 'professional_id' })
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
  date: Timestamp;

  // @Column('int', { name: 'payment_id' })
  // paymentId: number;
}
