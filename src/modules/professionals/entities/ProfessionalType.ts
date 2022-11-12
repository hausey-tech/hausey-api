import { Entity, Column } from 'typeorm';

import Base from '../../../shared/typeorm/entities/Base';

@Entity('professional_types')
class ProfessionalType extends Base {
  @Column('varchar')
  name: string;
}

export default ProfessionalType;
