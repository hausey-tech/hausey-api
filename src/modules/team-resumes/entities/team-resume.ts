import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Patient } from '../../patients/entities/patient';
import { Professional } from '../../professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Role } from '../../roles/entities/role';

@Entity('team_resumes')
export class TeamResume extends BaseEntity {
  @Column('varchar', { name: 'observation' })
  observation: string;

  @Column('varchar', { name: 'file_url', nullable: true })
  fileUrl: string;

  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column('varchar', { name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;
}
