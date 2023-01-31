import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

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

  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
