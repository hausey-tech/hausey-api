import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { User } from '../../users/entities/user';

@Entity('seller_code_sellers')
export class SellerCodeSeller extends BaseEntity {
  @Column('varchar')
  sellerCodeId: string;

  @ManyToOne(() => SellerCode)
  @JoinColumn()
  sellerCode: SellerCode;

  @Column('varchar')
  sellerId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  seller: User;

  @Column('int')
  fee: number;
}
