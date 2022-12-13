import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientAnamnesisService } from '../services/create-patient-anamnesis';

export class PatientAnamnesesController {
  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({ working: 'In progress...' });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPatientAnamnesisService = container.resolve(
      CreatePatientAnamnesisService,
    );

    const patientAnamnesis = await createPatientAnamnesisService.execute(
      payload,
    );

    return response.json(patientAnamnesis);
  }
}
