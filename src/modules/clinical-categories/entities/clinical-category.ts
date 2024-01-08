import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('clinical_categories')
export class ClinicalCategory extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;
}
