import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance } from '../../utils/stripe-instance';

interface Props {
  name: string;
  description: string;
  price: number;
}

@injectable()
export class CreateProduct {
  public async execute({
    name,
    description,
    price,
  }: Props): Promise<Stripe.Product> {
    const product = await stripeInstance.products.create({
      name,
      description,
      default_price_data: {
        currency: 'brl',
        unit_amount: price,
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      },
    });

    return product;
  }
}
