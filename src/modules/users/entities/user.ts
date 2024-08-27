import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Role } from '../../roles/entities/role';
import { UserEntity } from '../../../shared/typeorm/entities';
import { SellerCode } from '../../seller-codes/entities/seller-code';

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

  @Column('varchar', { nullable: true })
  fcmToken: string | null;

  @Column('varchar', { nullable: true })
  recipientId: string | null;

  @OneToOne(() => SellerCode, code => code.seller)
  sellerCode: SellerCode | null;
}
