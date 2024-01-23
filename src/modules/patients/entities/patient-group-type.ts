import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { GroupType } from '../../group-type/entities/group-type';
import { PatientGroup } from './patient-group';

@Entity('patient_group_type')
export class PatientGroupType extends BaseEntity {
  @Column('varchar', { name: 'patient_group_id' })
  patientGroupId: string;

  @ManyToOne(() => PatientGroup, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patientGroup: PatientGroup;

  @Column('varchar', { name: 'group_type_id' })
  groupTypeId: string;

  @ManyToOne(() => GroupType, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'group_type_id' })
  grouptype: GroupType;
}
