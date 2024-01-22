import { injectable, inject } from 'tsyringe';

import { FindOptionsWhere } from 'typeorm';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';

@injectable()
export class FindAllSellerCodes {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute(query: any): Promise<SellerCode[]> {
    const { sellerId, code } = query;
    const where: FindOptionsWhere<SellerCode> = {};

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (code) {
      where.code = code;
    }

    const sellerCodes = await this.sellerCodesRepository.find(where);

    return sellerCodes;
  }
}
