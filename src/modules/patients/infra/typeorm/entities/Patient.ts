import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import Base from '@shared/infra/typeorm/entities/Base';
import User from '@modules/users/infra/typeorm/entities/User';
import Plan from './Plan';

@Entity('patients')
class Patient extends Base {
  @Column('varchar', { name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar', { name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}

export default Patient;
