import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { ProfessionalType } from './professional-type';

@Entity('professional_specialties')
export class ProfessionalSpecialty extends BaseEntity {
  @Column('varchar', { name: 'professional_type_id' })
  professionalTypeId: string;

  @ManyToOne(() => ProfessionalType)
  @JoinColumn({ name: 'professional_type_id' })
  professionalType: ProfessionalType;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('int', { nullable: true })
  price: number;
}
