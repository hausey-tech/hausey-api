import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from './patient';
import { Role } from '../../roles/entities/role';
import { Specialty } from '../../specialties/entities/specialty';

@Entity('patient_professional_assistance')
export class PatientProfessionalAssistance extends BaseEntity {
  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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

  @Column('varchar', { name: 'assistance_type' })
  assistanceType:
    | 'Grupo'
    | 'Individual'
    | 'Não Necessita'
    | 'Crítico'
    | 'Rotina';

  @Column('varchar', { nullable: true })
  specialtyId: string | null;

  @ManyToOne(() => Specialty)
  @JoinColumn()
  specialty: Specialty | null;
}
