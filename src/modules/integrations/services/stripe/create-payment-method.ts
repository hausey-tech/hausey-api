import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance, stripePTInstance } from '../../utils/stripe-instance';

interface Card {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

interface Props {
  customerId: string;
  card: Card;
  country: string;
}

@injectable()
export class CreatePaymentMethod {
  public async execute({
    customerId,
    card,
    country,
  }: Props): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    if (country !== 'pt') {
      const { number, expMonth, expYear, cvc } = card;
      const paymentMethod = await stripeInstance.paymentMethods.create({
        type: 'card',
        card: {
          number,
          exp_month: expMonth,
          exp_year: expYear,
          cvc,
        },
      });

      await stripeInstance.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      return paymentMethod;
    }
    const { number, expMonth, expYear, cvc } = card;
    const paymentMethod = await stripePTInstance.paymentMethods.create({
      type: 'card',
      card: {
        number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });

    await stripeInstance.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    return paymentMethod;
  }
}
