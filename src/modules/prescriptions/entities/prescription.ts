import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Appointment } from '../../appointments/entities/appointment';
import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('prescriptions')
export class Prescription extends BaseEntity {
  @Column('varchar', { name: 'appointment_id' })
  appointmentId: string;

  @ManyToOne(() => Appointment, appointment => appointment.prescriptions)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column('varchar', { name: 'external_id' })
  externalId: string;

  @Column('varchar', { name: 'pdf_url' })
  pdfUrl: string;
}
