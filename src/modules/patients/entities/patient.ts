import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Address } from '../../addresses/entities/AddressTest';
import { Plan } from '../../plans/entities/plan';

@Entity('patients')
export class Patient extends UserEntity {
  @Column('varchar', { name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToOne(() => Address, address => address.patient)
  address: Address;
}
