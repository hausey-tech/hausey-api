import express, { Router } from 'express';
import { StripeController } from '../controllers/stripe-controller';

export const stripeWebhookRoutes = Router();
const stripeController = new StripeController();

stripeWebhookRoutes.post(
  '/',
  express.raw({ type: 'application/json' }),
  stripeController.webhook,
);
