import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAppointmentsByProfessionalService } from '../services/find-appointments-by-professional';
import { SetAppointmentProfessionalService } from '../services/set-appointment-professional';

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

  public async setAppointmentProfessional(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const setAppointmentProfessionalService = container.resolve(
      SetAppointmentProfessionalService,
    );

    const appointment = await setAppointmentProfessionalService.execute(
      payload,
    );

    return response.json(appointment);
  }
}
