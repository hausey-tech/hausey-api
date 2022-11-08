import { Column, Entity } from 'typeorm';

import Base from '@shared/infra/typeorm/entities/Base';

@Entity('plans')
class Plan extends Base {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  discount: number;
}

export default Plan;
