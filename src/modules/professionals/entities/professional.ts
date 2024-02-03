import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from '../../roles/entities/role';
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

  @Column('varchar', { name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column('varchar', { nullable: true })
  fcmToken: string | null;
}
