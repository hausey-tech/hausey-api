import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { CreateMessageService } from '../services/create-message-service';
import { GetUserMessagesService } from '../services/get-messages';

export class MessagesController {
  public async getInAppMessage(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;
    const getMessagesService = container.resolve(GetUserMessagesService);
    const message = await getMessagesService.execute({ userId: id });
    return response.json(message);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { body: reqBody, file } = request;
    const { type, to, title, body, startsAt, expiresAt } = reqBody;
    const createMessageService = container.resolve(CreateMessageService);
    await createMessageService.execute({
      type,
      to,
      image: file,
      title,
      body,
      startsAt,
      expiresAt,
    });
    return response.json({ message: 'Mensagem enviada com sucesso!' });
  }
}
