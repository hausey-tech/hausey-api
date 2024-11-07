import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCallService } from 'modules/integrations/services/programmable-voice-twilio';
import { AppError } from 'shared/errors/app-error';
// import { AlertProfessionalService } from '../services/alertProfessional.service';

export class AlertProfessionalController {
  public async create(request: Request, response: Response): Promise<Response> {
    // const { professionalId } = request.body;
    try {
      const twilioResponse = container.resolve(CreateCallService);
      await twilioResponse.createCall();

      return response.json({ message: 'Ligação efetuada com sucesso' });
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
