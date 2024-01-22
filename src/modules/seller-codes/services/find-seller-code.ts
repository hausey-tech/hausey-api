import { injectable, inject } from 'tsyringe';

import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { AppError } from '../../../shared/errors/app-error';

interface Props {
  code?: string;
  sellerId?: string;
}
@injectable()
export class FindSellerCode {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute({ code, sellerId }: Props): Promise<SellerCode> {
    let sellerCode: SellerCode;
    if (sellerId) {
      const codeExists = await this.sellerCodesRepository.findBySellerId(
        sellerId,
      );

      if (!codeExists) {
        throw new AppError('Não existe um código com sellerId!');
      }
      sellerCode = codeExists;
    }
    if (code) {
      const codeExists = await this.sellerCodesRepository.findByCode(code);

      if (!codeExists) {
        throw new AppError('Não existe um código com esses caracteres!');
      }
      sellerCode = codeExists;
    }

    return sellerCode;
  }
}
