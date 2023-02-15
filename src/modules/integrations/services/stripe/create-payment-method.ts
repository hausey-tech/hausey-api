import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance } from '../../utils/stripe-instance';

interface Card {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

interface Props {
  customerId: string;
  card: Card;
}

@injectable()
export class CreatePaymentMethod {
  public async execute({
    customerId,
    card,
  }: Props): Promise<Stripe.Response<Stripe.PaymentMethod>> {
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
}
