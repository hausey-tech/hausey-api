import { Entity, Column } from 'typeorm';

import { Base } from '../../../shared/typeorm/entities';

@Entity('professional_specialties')
export class ProfessionalSpecialty extends Base {
  @Column('varchar')
  name: string;
}
