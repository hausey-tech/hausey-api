import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from '../../roles/entities/role';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Specialty } from '../../specialties/entities/specialty';

@Entity('group_types')
export class GroupType extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('varchar', { name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column('varchar', { nullable: true })
  specialtyId: string | null;

  @ManyToOne(() => Specialty)
  @JoinColumn()
  specialty: Specialty | null;
}
