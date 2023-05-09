import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance } from '../../utils/stripe-instance';

interface Props {
  price: number;
  card: string;
  customerId: string;
}

@injectable()
export class CreatePaymentIntent {
  public async execute({
    card,
    price,
    customerId,
  }: Props): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: price,
      currency: 'brl',
      confirm: true,
      error_on_requires_action: true,
      payment_method: card,
      customer: customerId,
    });

    return paymentIntent;
  }
}
