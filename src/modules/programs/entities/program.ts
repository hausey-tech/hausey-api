import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('programs')
export class Program extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  price: number;
}
