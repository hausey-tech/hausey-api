import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserAndPatientService } from '../services/create-user-and-patient';
import { CreateSessionService } from '../../users/services/create-session';

export class PatientsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserAndPatientService = container.resolve(
      CreateUserAndPatientService,
    );

    await createUserAndPatientService.execute(payload);

    const createSessionService = container.resolve(CreateSessionService);

    const { email, password } = payload;

    const session = await createSessionService.execute({
      email,
      password,
      role: 'patient',
    });

    return response.json(session);
  }
}
