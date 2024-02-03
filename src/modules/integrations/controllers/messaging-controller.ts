import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { SendNotificationService } from '../services/send-notification';

export class MessagingController {
  public async send(request: Request, response: Response): Promise<Response> {
    const { userId, professionalId, patientId, message } = request.body;
    const sendNotificationService = container.resolve(SendNotificationService);
    await sendNotificationService.execute({
      userId,
      professionalId,
      patientId,
      message,
    });
    return response.json({ message: 'Notificação enviada com sucesso!' });
  }
}
