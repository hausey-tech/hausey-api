import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities';

@Entity('professional_specialties')
export class ProfessionalSpecialty extends BaseEntity {
  @Column('varchar')
  name: string;
}
