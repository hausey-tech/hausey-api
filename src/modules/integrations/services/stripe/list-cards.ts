import Stripe from 'stripe';
import { injectable } from 'tsyringe';

import { stripeInstance } from '../../utils/stripe-instance';

interface Props {
  customerId: string;
}

@injectable()
export class ListCards {
  public async execute({ customerId }: Props): Promise<Stripe.PaymentMethod[]> {
    const { data } = await stripeInstance.paymentMethods.list({
      customer: customerId,
    });
    return data;
  }
}
