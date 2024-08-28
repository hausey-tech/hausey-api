import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';

@injectable()
export class CreateSellerCode {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
  ) {}

  public async execute({
    code,
    sellerId,
    promotionCodeId,
    discount,
    fee,
    maxUse,
    free,
  }: ICreateSellerCodeDTO): Promise<SellerCode> {
    const codeExists = await this.sellerCodesRepository.findByCode(code);

    if (codeExists) {
      throw new AppError('Já existe um código para esse usuário!');
    }

    const sellerCode = await this.sellerCodesRepository.create({
      code,
      sellerId,
      promotionCodeId,
      discount,
      fee,
      maxUse,
      free,
    });

    return this.sellerCodesRepository.save(sellerCode);
  }
}
