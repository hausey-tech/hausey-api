import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from './patient';
import { Role } from '../../roles/entities/role';
import { PatientGroupType } from './patient-group-type';

@Entity('patient_group')
export class PatientGroup extends BaseEntity {
  @Column('varchar')
  observations: string;

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

  @OneToMany(
    () => PatientGroupType,
    patientGroupType => patientGroupType.patientGroup,
  )
  patientGroupTypes: PatientGroupType[];
}
