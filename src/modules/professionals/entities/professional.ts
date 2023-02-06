import { Entity, Column, OneToMany } from 'typeorm';

import { ProfessionalSpecialty } from './professional-specialty';
import { UserEntity } from '../../../shared/typeorm/entities';

@Entity('professionals')
export class Professional extends UserEntity {
  @Column('varchar', { nullable: true })
  registration: string;

  @Column('varchar', { name: 'registration_uf', nullable: true })
  registrationUf: string;

  @Column('varchar', { name: 'memed_status', nullable: true })
  memedStatus: string;

  @OneToMany(
    () => ProfessionalSpecialty,
    professionalSpecialty => professionalSpecialty.professional,
  )
  specialties: ProfessionalSpecialty[];
}
