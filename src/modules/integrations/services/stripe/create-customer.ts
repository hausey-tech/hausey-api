import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { stripeInstance } from '../../utils/stripe-instance';

interface Customer {
  email: string;
  name: string;
}

@injectable()
export class CreateCustomer {
  public async execute({
    email,
    name,
  }: Customer): Promise<Stripe.Response<Stripe.Customer>> {
    const customer = await stripeInstance.customers.create({
      email,
      name,
      description: 'Created by HauseyAPI',
    });

    return customer;
  }
}
