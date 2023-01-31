import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column('varchar', { name: 'address_line_1', length: 50 })
  addressLine1: string;

  @Column('varchar', { name: 'address_line_2', length: 50, nullable: true })
  addressLine2: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  state: string;

  @Column('varchar', { name: 'zip_or_postcode', nullable: true })
  zipOrPostcode: string;

  @Column('varchar')
  country: string;
}
