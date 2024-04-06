import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PagarmeWebhookService } from '../services/pagarme/pagarme-webhook-service';

export class PagarmeController {
  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { body } = request;
    const pagarmeWebhookService = container.resolve(PagarmeWebhookService);
    await pagarmeWebhookService.execute(body);
    return response.json({ message: 'Webhook recebido com sucesso!' });
  }
}
