import { Entity, Column } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('professional_types')
export class ProfessionalType extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int', { nullable: true })
  price: number;

  @Column('boolean', { name: 'has_specialties', default: false })
  hasSpecialties: boolean;
}
