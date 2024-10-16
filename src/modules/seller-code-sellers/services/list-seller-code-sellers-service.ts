import { injectable, inject } from 'tsyringe';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';

@injectable()
export class ListSellerCodeSellersService {
  constructor(
    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,
  ) {}

  public async execute(idSeller: string): Promise<SellerCodeSeller[]> {
    const sellers: SellerCodeSeller[] =
      await this.sellerCodeSellersRepository.findBySellerId(idSeller);
    return sellers;
  }
}
