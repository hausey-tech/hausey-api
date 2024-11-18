import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AlertProfessionalService } from '../services/alertProfessional.service';
import { TryCallProfessionalService } from '../services/statusProfessional.service';

let status = false;

export class AlertProfessionalController {
  public async create(request: Request, response: Response): Promise<Response> {
    if (status === false) {
      status = true;
      const alertProfessional = container.resolve(AlertProfessionalService);
      const message = await alertProfessional.execute();
      status = false;
      return response.json({ message });
    }
    status = false;
    return response.json({ message: 'Já existe uma ligação em andamento.' });
  }

  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { To } = request.body;
      const alertProfessional = container.resolve(TryCallProfessionalService);
      await alertProfessional.execute(To);

      return response.status(200).send({ message: 'Webhook recebido' });
    } catch (error) {
      return response.status(400).send({ message: error.message });
    }
  }
}
