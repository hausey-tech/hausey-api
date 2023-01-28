import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientService } from '../services/create-patient';
import { UpdatePatientService } from '../services/update-patient';
import { CreateSessionService } from '../../sessions/services/create-session';

export class PatientsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPatientService = container.resolve(CreatePatientService);

    await createPatientService.execute(payload);

    const createSessionService = container.resolve(CreateSessionService);

    const { email, password } = payload;

    const session = await createSessionService.execute({
      email,
      password,
      role: 'patient',
    });

    return response.json(session);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.params;
    const payload = request.body;

    const updatePatientService = container.resolve(UpdatePatientService);

    const patient = await updatePatientService.execute(patientId, payload);

    return response.json(patient);
  }
}
