import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAppointmentsByPatientService } from '../services/find-appointments-by-patient';

export class PatientsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.query;
    const { roleId } = request.user;

    const findAppointmentsByPatientService = container.resolve(
      FindAppointmentsByPatientService,
    );

    const appointments = await findAppointmentsByPatientService.execute(
      (patientId as string) || roleId,
    );

    return response.json(appointments);
  }
}
