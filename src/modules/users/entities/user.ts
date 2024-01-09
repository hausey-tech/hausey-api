import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Role } from 'modules/roles/entities/role';
import { UserEntity } from '../../../shared/typeorm/entities';

@Entity('users')
export class User extends UserEntity {
  @Column('varchar', { name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
