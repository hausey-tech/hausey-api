import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { CreateSubscription } from '../services/stripe/create-subscription';
import { CreateCheckoutSession } from '../services/stripe/create-checkout-session';
import { HandleWebhook } from '../services/stripe/handle-webhook';
import { ListCards } from '../services/stripe/list-cards';
import { CreateBillingPortalSession } from '../services/stripe/create-billing-portal-session';
import { CreateAccountLinkService } from '../services/stripe/create-account-link';
import { HandlePtWebhook } from '../services/stripe/handle-pt-webhook';

export class StripeController {
  public async listCards(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.params;

    const listCards = container.resolve(ListCards);

    try {
      const cards = await listCards.execute({
        customerId,
      });
      return response.json(cards);
    } catch (err) {
      throw new AppError(err.raw.message, err.statusCode);
    }
  }

  public async createSubscription(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId, priceId, card, country } = request.body;

    const createSubscription = container.resolve(CreateSubscription);

    const subscription = await createSubscription.execute({
      patientId,
      priceId,
      card,
      country: country === '' ? 'br' : 'pt',
    });
    return response.json(subscription);
  }

  public async createCheckoutSession(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId, priceId } = request.body;

    const createSession = container.resolve(CreateCheckoutSession);

    const session = await createSession.execute({
      patientId,
      priceId,
    });
    return response.json(session);
  }

  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const sig = request.headers['stripe-signature'];
    const { body } = request;

    const handleWebhook = container.resolve(HandleWebhook);

    try {
      await handleWebhook.execute({ sig, body });
    } catch (err) {
      throw new AppError(`Webhook Error: ${err.message}`);
    }

    return response.json();
  }

  public async ptWebhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const sig = request.headers['stripe-signature'];
    const { body } = request;

    const handleWebhook = container.resolve(HandlePtWebhook);

    try {
      await handleWebhook.execute({ sig, body });
    } catch (err) {
      throw new AppError(`Webhook Error: ${err.message}`);
    }

    return response.json();
  }

  public async createBillingPortalSession(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;
    const createBillingPortalSession = container.resolve(
      CreateBillingPortalSession,
    );
    const session = await createBillingPortalSession.execute({
      patientId: id,
    });
    return response.json(session);
  }

  public async createAccountLink(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId, type } = request.body;
    const createAccountLinkService = container.resolve(
      CreateAccountLinkService,
    );
    const url = await createAccountLinkService.execute({
      userId,
      type,
    });
    return response.json({ url });
  }
}
