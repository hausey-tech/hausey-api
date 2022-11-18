import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { ProfessionalType } from '../../professionals/entities/professional-type';
import { Program } from './program';

@Entity('program_professional_type_discounts')
export class ProgramProfessionalSpecialtyDiscount extends BaseEntity {
  @Column('varchar', { name: 'program_id' })
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: string;

  @Column('varchar', { name: 'professional_type_id' })
  professionalTypeId: string;

  @ManyToOne(() => ProfessionalType)
  @JoinColumn({ name: 'professional_type_id' })
  professionalType: ProfessionalType;

  @Column('int')
  discount: number;
}
