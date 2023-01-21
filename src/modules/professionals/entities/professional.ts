import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Specialty } from './specialty';

@Entity('professionals')
export class Professional extends UserEntity {
  @Column('varchar', { name: 'specialty_id' })
  specialtyId: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @Column('varchar', { name: 'specialty_registration', nullable: true })
  specialtyRegistration: string;

  @Column('varchar', { nullable: true })
  registration: string;

  @Column('varchar', { name: 'registration_uf', nullable: true })
  registrationUf: string;

  @Column('varchar', { name: 'memed_status', nullable: true })
  memedStatus: string;
}
