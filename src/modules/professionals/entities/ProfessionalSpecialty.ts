import { Entity, Column } from 'typeorm';

import Base from '../../../shared/typeorm/entities/Base';

@Entity('professional_specialties')
class ProfessionalSpecialty extends Base {
  @Column('varchar')
  name: string;
}

export default ProfessionalSpecialty;
