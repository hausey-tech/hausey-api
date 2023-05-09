import { Column } from 'typeorm';

import { BaseEntity } from './base';

export abstract class UserEntity extends BaseEntity {
  @Column('varchar')
  email: string;

  @Column('varchar', { nullable: true })
  password: string;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  document: string;

  @Column('varchar', { nullable: true })
  birthdate: string;

  @Column('varchar', { name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column('varchar', { length: 1, nullable: true })
  sex: 'M' | 'F';
}
