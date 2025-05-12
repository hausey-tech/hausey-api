import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { WhatsappService } from './whatsapp.service';

export class WhatsappController {
  public async handleIncomingMessage(
    request: Request,
    response: Response,
  ): Promise<Response> {
    console.log('Entrou no controller');

    const whatsappService = container.resolve(WhatsappService);
    const { body } = request;

    console.log('Body recebido:', body);

    await whatsappService.processIncomingMessage(body);

    return response.json({ message: 'Mensagem recebida!' });
  }
}
