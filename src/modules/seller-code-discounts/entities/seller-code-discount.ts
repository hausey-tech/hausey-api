import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { Plan } from '../../plans/entities/plan';

@Entity('seller_code_discounts')
export class SellerCodeDiscount extends BaseEntity {
  @Column('varchar')
  sellerCodeId: string;

  @ManyToOne(() => SellerCode)
  @JoinColumn()
  sellerCode: SellerCode;

  @Column('varchar')
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn()
  plan: Plan;

  @Column('int')
  discount: number;
}
