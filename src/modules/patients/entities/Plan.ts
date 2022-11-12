import { Column, Entity } from 'typeorm';

import { Base } from '../../../shared/typeorm/entities';

@Entity('plans')
export class Plan extends Base {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  discount: number;
}
