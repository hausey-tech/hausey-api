import { injectable, inject, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';
import { ISellerCodeDiscountsRepository } from '../../seller-code-discounts/contracts/repositories/seller-code-discounts-repository';
import { CreateSellerCodeSellerService } from '../../seller-code-sellers/services/create-seller-code-seller-service';

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
    fee,
    free,
    maxUse,
    type,
    discounts,
    sellers,
  }: ICreateSellerCodeDTO): Promise<SellerCode> {
    const codeExists = await this.sellerCodesRepository.findByCode(code);

    if (codeExists) {
      throw new AppError('Já existe um código para esse usuário!');
    }

    const sellerCode = await this.sellerCodesRepository.create({
      code,
      sellerId,
      fee,
      free,
      maxUse,
      type,
    });

    await this.sellerCodesRepository.save(sellerCode);

    if (discounts?.length > 0) {
      await Promise.all(
        discounts?.map(async discount => {
          const sellerCodeDiscount =
            await this.sellerCodeDiscountsRepository.create({
              sellerCodeId: sellerCode.id,
              planId: discount.planId,
              discount: discount.discount,
            });
          await this.sellerCodeDiscountsRepository.save(sellerCodeDiscount);
        }),
      );
    }

    if (sellers?.length > 0) {
      const createSellerCodeSellerService = container.resolve(
        CreateSellerCodeSellerService,
      );
      await Promise.all(
        sellers?.map(async seller => {
          try {
            await createSellerCodeSellerService.execute({
              sellerCodeId: sellerCode.id,
              sellerId: seller.sellerId,
              fee: seller.fee,
            });
          } catch (error) {
            console.error('Erro ao vincular vendedor ao código: ', error);
          }
        }),
      );
    }

    return sellerCode;
  }
}
