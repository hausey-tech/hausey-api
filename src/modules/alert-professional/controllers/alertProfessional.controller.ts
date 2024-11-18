import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AlertProfessionalService } from '../services/alertProfessional.service';
import { TryCallProfessionalService } from '../services/statusProfessional.service';

let status = true;

export class AlertProfessionalController {
  private readonly timeToCall: number;

  constructor() {
    this.timeToCall = Number(process.env.TIME_TO_CALL);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    if (status === true) {
      status = false;
      const alertProfessional = container.resolve(AlertProfessionalService);
      const message = await alertProfessional.execute();
      status = true;
      return response.json({ message });
    }
    status = true;
    return response.json({ message: 'Já existe uma ligação em andamento.' });
  }

  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { To } = request.body;
      const alertProfessional = container.resolve(TryCallProfessionalService);
      await new Promise(resolve => setTimeout(resolve, this.timeToCall));
      await alertProfessional.execute(To);

      return response.status(200).send({ message: 'Webhook recebido' });
    } catch (error) {
      return response.status(400).send({ message: error.message });
    }
  }
}
