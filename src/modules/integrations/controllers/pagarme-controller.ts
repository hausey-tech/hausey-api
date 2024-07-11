import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PagarmeWebhookService } from '../services/pagarme/pagarme-webhook-service';
import { ListPagarmeCustomerChargesService } from '../services/pagarme/list-pagarme-customer-charges-service';
import { CreatePagarmeBoletoOrderService } from '../services/pagarme/create-pagarme-boleto-order-service';

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

  public async listCharges(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.params;
    const listPagarmeCustomerChargesService = container.resolve(
      ListPagarmeCustomerChargesService,
    );
    const charges = await listPagarmeCustomerChargesService.execute({
      customerId,
    });
    return response.json(charges);
  }

  public async createBoletoOrder(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { price, date, userId, customer } = request.body;
    const createPagarmeBoletoOrderService = container.resolve(
      CreatePagarmeBoletoOrderService,
    );
    const pdfLink = await createPagarmeBoletoOrderService.execute({
      price,
      date,
      userId,
      customer,
    });
    return response.json({ link: pdfLink });
  }
}
