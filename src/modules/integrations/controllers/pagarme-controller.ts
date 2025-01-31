import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PagarmeWebhookService } from '../services/pagarme/pagarme-webhook-service';
import { ListPagarmeCustomerChargesService } from '../services/pagarme/list-pagarme-customer-charges-service';
import { CreatePagarmeBoletoOrderService } from '../services/pagarme/create-pagarme-boleto-order-service';
import { CreatePagarmeCustomerService } from '../services/pagarme/create-pagarme-customer-service';

const clients = new Map<string, Response>();

export class PagarmeController {
  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { body } = request;
    const pagarmeWebhookService = container.resolve(PagarmeWebhookService);
    await pagarmeWebhookService.execute(body);
    console.log('clients webhook =>', clients);
    clients.forEach(client => {
      client.write(`event: status-payment\n`);
      client.write(`data: ${JSON.stringify(body.data.charges.status)}\n\n`);
    });
    return response.json({ message: 'Webhook recebido com sucesso!' });
  }

  public async events(request: Request, response: Response): Promise<void> {
    console.log('clients', clients);
    const userId = request.query.user as string;
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'Keep-alive');
    response.setHeader('Access-Control-Allow-Origin', '*');

    clients.set(userId, response);
    response.write('event: connected\n');
    response.write(`data: {"message": "SSE connection established"}\n\n`);

    const interval = setInterval(() => {
      response.write(
        `data: {"message": "Atualização SSE", "timestamp": "${new Date().toISOString()}"}\n\n`,
      );
    }, 40000);

    request.on('close', () => {
      console.log('🔴 Cliente desconectado. Finalizando SSE.');
      clients.delete(userId);
      clearInterval(interval);
    });
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
    const { price, date, users, customer } = request.body;
    const createPagarmeBoletoOrderService = container.resolve(
      CreatePagarmeBoletoOrderService,
    );
    const pdfLink = await createPagarmeBoletoOrderService.execute({
      price,
      date,
      users,
      customer,
    });
    return response.json({ link: pdfLink });
  }

  public async createCustomer(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { body } = request;
    const createPagarmeCustomerService = container.resolve(
      CreatePagarmeCustomerService,
    );
    await createPagarmeCustomerService.execute(body);
    return response.json({ message: 'Conta de pagamento criada com sucesso!' });
  }
}
