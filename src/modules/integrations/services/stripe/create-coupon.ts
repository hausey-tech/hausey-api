import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/app-error';
import { stripeInstance } from '../../utils/stripe-instance';

interface Props {
  code: string;
}

@injectable()
export class CreateCoupon {
  public async execute({
    code,
  }: Props): Promise<Stripe.Response<Stripe.PromotionCode>> {
    try {
      const coupon = await stripeInstance.promotionCodes.create({
        coupon: 'OcAHw1zM',
        code,
      });
      return coupon;
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }
  }
}
