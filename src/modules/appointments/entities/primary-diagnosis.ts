import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('primary_diagnoses')
export class PrimaryDiagnosis extends BaseEntity {
  @Column('varchar')
  description: string;
}
