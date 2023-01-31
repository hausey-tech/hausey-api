import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Address } from '../../addresses/entities/address';
import { Plan } from '../../plans/entities/plan';

@Entity('patients')
export class Patient extends UserEntity {
  @Column('varchar', { name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column('varchar', { name: 'address_id', nullable: true })
  addressId: string;

  @OneToOne(() => Address, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
