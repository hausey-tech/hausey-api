import { injectable, inject, container } from 'tsyringe';
import Stripe from 'stripe';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';
import { ISellerCodeDiscountsRepository } from '../../seller-code-discounts/contracts/repositories/seller-code-discounts-repository';
import { CreateSellerCodeSellerService } from '../../seller-code-sellers/services/create-seller-code-seller-service';
import { stripeInstance } from '../../integrations/utils/stripe-instance';
import { formatCentsToDollar } from '../utils/format-cents-to-dollar';

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
    region,
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
      let stripeCoupons: Stripe.ApiList<Stripe.Coupon>;
      if (region !== 'br') {
        stripeCoupons = await stripeInstance.coupons.list({
          limit: 100,
        });
      }
      await Promise.all(
        discounts?.map(async discount => {
          let promoCodeId: string;

          if (region !== 'br') {
            let stripeCoupon = stripeCoupons.data.find(
              coupon => coupon.name === formatCentsToDollar(discount.discount),
            );

            if (!stripeCoupon) {
              stripeCoupon = await stripeInstance.coupons.create({
                amount_off: discount.discount,
                name: formatCentsToDollar(discount.discount),
                currency: 'USD',
                duration: 'forever',
              });
            }

            const promoCode = await stripeInstance.promotionCodes.create({
              coupon: stripeCoupon.id,
              code,
              max_redemptions: maxUse,
            });

            promoCodeId = promoCode.id;
          }

          const sellerCodeDiscount =
            await this.sellerCodeDiscountsRepository.create({
              sellerCodeId: sellerCode.id,
              planId: discount.planId,
              discount: discount.discount,
              stripePromoCodeId: promoCodeId,
            });
          await this.sellerCodeDiscountsRepository.save(sellerCodeDiscount);
        }),
      );
    }

    console.log('SELLERS =>', sellers);

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
