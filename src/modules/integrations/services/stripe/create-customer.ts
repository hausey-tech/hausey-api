import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance, stripePTInstance } from '../../utils/stripe-instance';

interface Customer {
  email: string;
  name: string;
  country: string;
}

@injectable()
export class CreateCustomer {
  public async execute({
    email,
    name,
    country,
  }: Customer): Promise<Stripe.Response<Stripe.Customer>> {
    if (country !== 'pt') {
      const customer = await stripeInstance.customers.create({
        email,
        name,
        description: 'Created by HauseyAPI',
      });

      return customer;
    }
    const customer = await stripePTInstance.customers.create({
      email,
      name,
      description: 'Created by HauseyAPI',
    });

    return customer;
  }
}
