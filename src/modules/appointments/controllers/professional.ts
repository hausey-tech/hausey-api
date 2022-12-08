import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAppointmentsByProfessionalService } from '../services/find-appointments-by-professional';

export class ProfessionalsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { professionalId } = request.params;

    const findAppointmentsByProfessionalService = container.resolve(
      FindAppointmentsByProfessionalService,
    );

    const appointments = await findAppointmentsByProfessionalService.execute(
      professionalId,
    );

    return response.json(appointments);
  }
}
