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
  }: Props): Promise<Stripe.Response<Stripe.Coupon>> {
    try {
      const coupon = await stripeInstance.coupons.create({
        duration: 'forever',
        name: code,
        amount_off: 500,
        currency: 'BRL',
        applies_to: {
          products: ['prod_POQjTVMZ5NerEv'],
        },
      });
      return coupon;
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }
  }
}
