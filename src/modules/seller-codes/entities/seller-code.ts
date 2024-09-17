import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { User } from '../../users/entities/user';
import { SellerCodeSeller } from '../../seller-code-sellers/entities/seller-code-seller';
import { SellerCodeDiscount } from '../../seller-code-discounts/entities/seller-code-discount';

@Entity('seller_codes')
export class SellerCode extends BaseEntity {
  @Column('varchar')
  code: string;

  @Column('varchar', { name: 'seller_id', nullable: true })
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column('int', { default: 0 })
  uses: number;

  @Column('boolean', { default: true })
  active: boolean;

  @Column('int', { nullable: true })
  fee: number | null;

  @Column('int', { nullable: true })
  maxUse: number | null;

  @Column('boolean', { default: false })
  free: boolean;

  @OneToMany(() => SellerCodeDiscount, discount => discount.sellerCode)
  discounts: SellerCodeDiscount[];

  @OneToMany(() => SellerCodeSeller, seller => seller.sellerCode)
  sellers: SellerCodeSeller[];
}
