import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { CreateMessageService } from '../services/create-message-service';
import { GetUserMessagesService } from '../services/get-messages';
import { CreateMessageToUserService } from '../services/create-message-to-user-service';

export class MessagesController {
  public async getInAppMessage(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId } = request.query;
    const getMessagesService = container.resolve(GetUserMessagesService);
    const message = await getMessagesService.execute({
      userId: userId as string,
    });
    return response.json(message);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { body: reqBody, file } = request;
    const { type, to, title, body, link, startsAt, expiresAt } = reqBody;
    const createMessageService = container.resolve(CreateMessageService);
    await createMessageService.execute({
      type,
      to,
      image: file,
      title,
      body,
      link,
      startsAt,
      expiresAt,
    });
    return response.json({ message: 'Mensagem enviada com sucesso!' });
  }

  public async createMessageToUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { type, to, title, body } = request.body;
    const createMessageToUserService = container.resolve(
      CreateMessageToUserService,
    );
    await createMessageToUserService.execute({
      type,
      to,
      title,
      body,
    });
    return response.json({ message: 'Mensagem enviada com sucesso!' });
  }
}
