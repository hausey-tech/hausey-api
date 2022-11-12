import { Entity, Column } from 'typeorm';

import { Base } from '../../../shared/typeorm/entities';

@Entity('professional_types')
export class ProfessionalType extends Base {
  @Column('varchar')
  name: string;
}
