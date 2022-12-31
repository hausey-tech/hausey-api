import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListPatientAnamnesesService } from '../services/list-patient-anamneses';
import { CreatePatientAnamnesisService } from '../services/create-patient-anamnesis';

export class PatientAnamnesesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.query;
    const { id } = request.user;

    const listPatientAnamnesesService = container.resolve(
      ListPatientAnamnesesService,
    );

    let payload: { id: string; type: 'patient' | 'user' };

    if (patientId) {
      payload = {
        id: patientId as string,
        type: 'patient',
      };
    } else {
      payload = {
        id,
        type: 'user',
      };
    }

    const patientAnamneses = await listPatientAnamnesesService.execute(payload);

    return response.json(patientAnamneses);
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
