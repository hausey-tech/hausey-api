import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { User } from '../../users/entities/user';

@Entity('seller_codes')
export class SellerCode extends BaseEntity {
  @Column('varchar')
  code: string;

  @Column('varchar', { name: 'seller_id', nullable: true })
  sellerId: string;

  @Column('varchar', { name: 'promo_code_id', nullable: true })
  promotionCodeId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column('int', { default: 0 })
  uses: number;

  @Column('boolean', { default: true })
  active: boolean;

  @Column('int', { nullable: true })
  discount: number | null;

  @Column('int', { nullable: true })
  fee: number | null;

  @Column('int', { nullable: true })
  maxUse: number | null;

  @Column('boolean', { default: false })
  free: boolean;
}
