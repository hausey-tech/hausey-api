import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Professional } from '../../professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from '../../patients/entities/patient';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column('varchar', { name: 'professional_id', nullable: true })
  professionalId: string;

  @OneToOne(() => Professional, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('varchar', { name: 'patient_id', nullable: true })
  patientId: string;

  @OneToOne(() => Patient, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'address_line_1', length: 50 })
  addressLine1: string;

  @Column('varchar', { name: 'address_line_2', length: 50, nullable: true })
  addressLine2: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  state: string;

  @Column('varchar', { name: 'zip_or_postcode', nullable: true })
  zipOrPostcode: string;

  @Column('varchar')
  country: string;
}
