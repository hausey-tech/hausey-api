import { injectable, inject } from 'tsyringe';
import { SellerCodeSeller } from '../entities/seller-code-seller';
import { ISellerCodeSellersRepository } from '../contracts/repositories/seller-code-sellers-repository';

@injectable()
export class ListSellerCodeSellersService {
  constructor(
    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,
  ) {}

  public async execute(): Promise<SellerCodeSeller[]> {
    const idSeller = 'de3514fc-0009-43b0-878d-28944b67e463';
    const sellers: SellerCodeSeller[] =
      await this.sellerCodeSellersRepository.findBySellerId(idSeller);
    console.log('Service.execute()');
    return sellers;
  }
}
