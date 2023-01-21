import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities';

@Entity('specialties')
export class Specialty extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int', { nullable: true })
  price: number;

  @Column('varchar', { nullable: true })
  group: string;

  @Column('int', { name: 'memed_id', nullable: true })
  memedId: number;
}
