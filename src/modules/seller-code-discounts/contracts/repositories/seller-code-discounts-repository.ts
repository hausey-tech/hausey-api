import { SellerCodeDiscount } from '../../entities/seller-code-discount';
import { ICreateSellerCodeDiscountDTO } from '../dtos/create-seller-code-discount-dto';

export interface ISellerCodeDiscountsRepository {
  create(
    sellerCodeDiscount: ICreateSellerCodeDiscountDTO,
  ): Promise<SellerCodeDiscount>;
  save(sellerCodeDiscount: SellerCodeDiscount): Promise<SellerCodeDiscount>;
}
