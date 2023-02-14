import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { UserEntity } from '../../../shared/typeorm/entities';
import { Address } from '../../addresses/entities/Address';
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

  @Column('varchar', { name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @Column('timestamp', { name: 'plan_expires_at', nullable: true })
  planExpiresAt: Date;
}
