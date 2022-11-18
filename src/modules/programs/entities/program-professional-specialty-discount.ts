import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { ProfessionalSpecialty } from '../../professionals/entities/professional-specialty';
import { Program } from './program';

@Entity('program_professional_specialty_discounts')
export class ProgramProfessionalSpecialtyDiscount extends BaseEntity {
  @Column('varchar', { name: 'program_id' })
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: string;

  @Column('varchar', { name: 'professional_specialty_id' })
  professionalSpecialtyId: string;

  @ManyToOne(() => ProfessionalSpecialty)
  @JoinColumn({ name: 'professional_specialty_id' })
  professionalSpecialty: ProfessionalSpecialty;

  @Column('int')
  discount: number;
}
