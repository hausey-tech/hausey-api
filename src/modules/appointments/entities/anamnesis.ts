import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Appointment } from './appointment';

@Entity('anamneses')
export class Anamnesis extends BaseEntity {
  @Column('varchar')
  description: string;

  @Column('varchar', { name: 'appointment_id' })
  appointmentId: string;

  @OneToOne(() => Appointment, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
