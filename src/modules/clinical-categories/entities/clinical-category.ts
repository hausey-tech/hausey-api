import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from 'modules/roles/entities/role';
import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('clinical_categories')
export class ClinicalCategory extends BaseEntity {
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
}
