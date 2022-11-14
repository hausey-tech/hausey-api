import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities';

@Entity('plans')
export class Plan extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  discount: number;
}
