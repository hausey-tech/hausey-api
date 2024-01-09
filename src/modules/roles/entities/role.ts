import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('roles')
export class Role extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  type: string;
}
