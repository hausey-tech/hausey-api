import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { ProfessionalSpecialty } from './professional-specialty';
import { UserEntity } from '../../../shared/typeorm/entities';
import { Address } from '../../addresses/entities/address';

@Entity('professionals')
export class Professional extends UserEntity {
  @Column('varchar', { nullable: true })
  registration: string;

  @Column('varchar', { name: 'registration_uf', nullable: true })
  registrationUf: string;

  @Column('varchar', { name: 'memed_status', nullable: true })
  memedStatus: string;

  @Column('varchar', { name: 'address_id', nullable: true })
  addressId: string;

  @OneToOne(() => Address, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(
    () => ProfessionalSpecialty,
    professionalSpecialty => professionalSpecialty.professional,
  )
  specialties: ProfessionalSpecialty[];
}
