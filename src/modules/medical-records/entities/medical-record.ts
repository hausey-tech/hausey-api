import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import { Appointment } from 'modules/appointments/entities/appointment';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('medical_records')
export class MedicalRecord extends BaseEntity {
  @Column('varchar')
  cid: string;

  @Column('varchar')
  description: string;

  @OneToOne(() => Appointment, appointment => appointment.medicalRecord)
  @JoinColumn()
  appointment: Appointment;
}
