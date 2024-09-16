import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';
import { ICreateSellerCodeSellerDTO } from '../contracts/dtos/create-seller-code-seller-dto';

export class SellerCodeSellersRepository
  implements ISellerCodeSellersRepository
{
  private ormRepository: Repository<SellerCodeSeller>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(SellerCodeSeller);
  }

  public async create(
    sellerCodeSeller: ICreateSellerCodeSellerDTO,
  ): Promise<SellerCodeSeller> {
    const seller = this.ormRepository.create(sellerCodeSeller);
    return this.ormRepository.save(seller);
  }

  public async save(
    sellerCodeSeller: SellerCodeSeller,
  ): Promise<SellerCodeSeller> {
    return this.ormRepository.save(sellerCodeSeller);
  }
}
