import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Professional } from './professional';
import { Specialty } from './specialty';

@Entity('professional_specialties')
export class ProfessionalSpecialty extends BaseEntity {
  @Column('varchar', { name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('varchar', { name: 'specialty_id' })
  specialtyId: string;

  @ManyToOne(() => Specialty, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;
}
