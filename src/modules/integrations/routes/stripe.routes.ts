import { celebrate } from 'celebrate';
import { Router } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import {
  CreateSubscriptionSchema,
  ListCardsSchema,
  CreateCheckoutSessionSchema,
} from '../celebrate-schemas/stripe';
import { StripeController } from '../controllers/stripe-controller';

export const stripeRoutes = Router();
const stripeController = new StripeController();

stripeRoutes.get(
  '/stripe/cards/:customerId',
  ensureAuthentication,
  celebrate(ListCardsSchema),
  stripeController.listCards,
);

stripeRoutes.post(
  '/stripe/checkout-session',
  ensureAuthentication,
  celebrate(CreateCheckoutSessionSchema),
  stripeController.createCheckoutSession,
);

stripeRoutes.post(
  '/stripe/subscription',
  ensureAuthentication,
  celebrate(CreateSubscriptionSchema),
  stripeController.createSubscription,
);

stripeRoutes.get(
  '/stripe/billing-portal-session',
  ensureAuthentication,
  stripeController.createBillingPortalSession,
);
