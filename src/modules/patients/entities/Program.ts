import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from '../../../shared/typeorm/entities';
import { ProfessionalSpecialty } from '../../professionals/entities';

@Entity('programs')
export class Program extends Base {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  discount: number;

  @Column('varchar', { name: 'professional_specialty_id' })
  professionalSpecialtyId: string;

  @ManyToOne(() => ProfessionalSpecialty)
  @JoinColumn({ name: 'professional_specialty_id' })
  professionalSpecialty: ProfessionalSpecialty;
}
