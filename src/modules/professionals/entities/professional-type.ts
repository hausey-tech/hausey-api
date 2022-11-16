import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('professional_types')
export class ProfessionalType extends BaseEntity {
  @Column('varchar')
  name: string;
}
