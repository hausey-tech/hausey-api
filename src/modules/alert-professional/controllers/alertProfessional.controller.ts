import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AlertProfessionalService } from '../services/alertProfessional.service';
import { TryCallProfessionalService } from '../services/statusProfessional.service';

export class AlertProfessionalController {
  private readonly timeToCall: string;

  constructor() {
    this.timeToCall = process.env.TIME_TO_CALL || '40000';
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const alertProfessional = container.resolve(AlertProfessionalService);
    const message = await alertProfessional.execute();
    return response.json({ message });
  }

  public async webhook(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { To } = request.body;
      const alertProfessional = container.resolve(TryCallProfessionalService);
      await new Promise(resolve =>
        setTimeout(resolve, Number(this.timeToCall)),
      );
      console.log(Number(this.timeToCall));
      await alertProfessional.execute(To);

      return response.status(200).send({ message: 'Webhook recebido' });
    } catch (error) {
      return response.status(400).send({ message: error.message });
    }
  }
}
