import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { CreateSubscription } from '../services/stripe/create-subscription';
import { HandleWebhook } from '../services/stripe/handle-webhook';
import { ListCards } from '../services/stripe/list-cards';

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
    const { patientId, priceId, card } = request.body;

    const createSubscription = container.resolve(CreateSubscription);

    const subscription = await createSubscription.execute({
      patientId,
      priceId,
      card,
    });
    return response.json(subscription);
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
}
