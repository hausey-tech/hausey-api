import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { SellerCodeDiscount } from '../entities/seller-code-discount';
import { ISellerCodeDiscountsRepository } from '../contracts/repositories/seller-code-discounts-repository';
import { ICreateSellerCodeDiscountDTO } from '../contracts/dtos/create-seller-code-discount-dto';

export class SellerCodeDiscountsRepository
  implements ISellerCodeDiscountsRepository
{
  private ormRepository: Repository<SellerCodeDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(SellerCodeDiscount);
  }

  public async create(
    sellerCodeDiscount: ICreateSellerCodeDiscountDTO,
  ): Promise<SellerCodeDiscount> {
    return this.ormRepository.create(sellerCodeDiscount);
  }

  public async save(
    sellerCodeDiscount: SellerCodeDiscount,
  ): Promise<SellerCodeDiscount> {
    return this.ormRepository.save(sellerCodeDiscount);
  }
}
