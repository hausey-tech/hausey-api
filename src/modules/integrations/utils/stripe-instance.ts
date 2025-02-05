import Stripe from 'stripe';

export const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const stripePTInstance = new Stripe(process.env.STRIPE_PT_SECRET_KEY, {
  apiVersion: '2022-11-15',
});
