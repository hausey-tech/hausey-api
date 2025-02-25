import { injectable, inject, container } from 'tsyringe';
import Stripe from 'stripe';
import { Logger } from 'pino';
import { generateRandomCode } from '../../users/utils/create-random-code';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../contracts/repositories/seller-codes';
import { SellerCode } from '../entities/seller-code';
import { ICreateSellerCodeDTO } from '../contracts/dtos/create-seller-code-dto';
import { ISellerCodeDiscountsRepository } from '../../seller-code-discounts/contracts/repositories/seller-code-discounts-repository';
import { CreateSellerCodeSellerService } from '../../seller-code-sellers/services/create-seller-code-seller-service';
import {
  stripeInstance,
  stripePTInstance,
} from '../../integrations/utils/stripe-instance';
import {
  formatCentsToDollar,
  formatCentsToEuro,
} from '../utils/format-cents-to-dollar';

@injectable()
export class CreateSellerCode {
  constructor(
    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,
    @inject('SellerCodeDiscountsRepository')
    private sellerCodeDiscountsRepository: ISellerCodeDiscountsRepository,
    @inject('Logger')
    private logger: Logger,
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
    name,
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
      let stripeCouponsPt: Stripe.ApiList<Stripe.Coupon>;
      if (region !== 'br' && region !== 'pt') {
        stripeCoupons = await stripeInstance.coupons.list({
          limit: 100,
        });
      } else if (region === 'pt') {
        stripeCouponsPt = await stripePTInstance.coupons.list({
          limit: 100,
        });
      }
      for (let index = 0; index < discounts.length; index += 1) {
        const discount = discounts[index];
        let promoCodeId: string;

        if (region !== 'br' && region !== 'pt') {
          let stripeCoupon = stripeCoupons.data.find(
            coupon => coupon.name === formatCentsToDollar(discount.discount),
          );

          /* eslint-disable no-await-in-loop */
          if (!stripeCoupon) {
            stripeCoupon = await stripeInstance.coupons.create({
              amount_off: discount.discount,
              name: formatCentsToDollar(discount.discount),
              currency: 'USD',
              duration: 'forever',
            });
          }

          /* eslint-disable no-await-in-loop */
          const promoCode = await stripeInstance.promotionCodes.create({
            coupon: stripeCoupon.id,
            code,
            max_redemptions: maxUse,
          });

          promoCodeId = promoCode.id;
        } else if (region !== 'br' && region === 'pt') {
          let stripeCoupon = stripeCouponsPt.data.find(
            coupon => coupon.name === formatCentsToEuro(discount.discount),
          );

          if (!stripeCoupon) {
            stripeCoupon = await stripePTInstance.coupons.create({
              amount_off: discount.discount,
              name: formatCentsToEuro(discount.discount),
              currency: 'EUR',
              duration: 'forever',
            });
          }

          let isUnique = false;
          let newCode = generateRandomCode(name);
          let codeAlreadyExists = await this.sellerCodesRepository.findByCode(
            newCode,
          );

          while (!isUnique) {
            console.log('comecei no while');
            newCode = generateRandomCode(name);
            console.log('newCode', newCode);
            codeAlreadyExists = await this.sellerCodesRepository.findByCode(
              newCode,
            );
            console.log('codeAlreadyExists', codeAlreadyExists);
            if (!codeAlreadyExists) {
              console.log('Entrei no if, é único');
              isUnique = true;
              console.log(newCode);
            }
          }

          console.log('antes de criar o promotion code', code);
          console.log('index', index);
          console.log('index === 0', index === 0, 'code', code);
          console.log('index === 1', index === 1, 'newCode', newCode);
          const promoCode = await stripePTInstance.promotionCodes.create({
            coupon: stripeCoupon.id,
            code: index === 0 ? code : newCode,
            max_redemptions: maxUse,
          });
          console.log('Depois de criar o promotion code');

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
      }
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
