import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('professional_specialties')
export class ProfessionalSpecialty extends BaseEntity {
  @Column('varchar')
  name: string;
}
