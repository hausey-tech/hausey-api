import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';
import { ISellerCodeDiscountsRepository } from '../../seller-code-discounts/contracts/repositories/seller-code-discounts-repository';

@injectable()
export class CreateSellerCode {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
    @inject('SellerCodeDiscountsRepository')
    private sellerCodeDiscountsRepository: ISellerCodeDiscountsRepository,
  ) {}

  public async execute({
    code,
    sellerId,
    discounts,
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
      fee,
      maxUse,
      free,
    });

    await this.sellerCodesRepository.save(sellerCode);

    await Promise.all(
      discounts.map(async discount => {
        const sellerCodeDiscount =
          await this.sellerCodeDiscountsRepository.create({
            sellerCodeId: sellerCode.id,
            planId: discount.planId,
            discount: discount.discount,
          });
        await this.sellerCodeDiscountsRepository.save(sellerCodeDiscount);
      }),
    );

    return sellerCode;
  }
}
