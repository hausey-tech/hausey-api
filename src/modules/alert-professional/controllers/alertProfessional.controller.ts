import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { AlertProfessionalService } from '../services/alertProfessional.service';

export class AlertProfessionalController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const alertProfessional = container.resolve(AlertProfessionalService);
      alertProfessional.execute();

      return response.json({ message: 'Ligação efetuada com sucesso' });
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
