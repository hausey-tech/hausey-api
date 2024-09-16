import { SellerCodeSeller } from '../../entities/seller-code-seller';
import { ICreateSellerCodeSellerDTO } from '../dtos/create-seller-code-seller-dto';

export interface ISellerCodeSellersRepository {
  create(
    sellerCodeSeller: ICreateSellerCodeSellerDTO,
  ): Promise<SellerCodeSeller>;
  save(sellerCodeSeller: SellerCodeSeller): Promise<SellerCodeSeller>;
}
