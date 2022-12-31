import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListPatientPrimaryDiagnosesService } from '../services/list-patient-primary-diagnoses';
import { CreatePatientPrimaryDiagnosisService } from '../services/create-patient-primary-diagnosis';

export class PatientPrimaryDiagnosesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.query;
    const { id } = request.user;

    const listPatientPrimaryDiagnosesService = container.resolve(
      ListPatientPrimaryDiagnosesService,
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

    const patientPrimaryDiagnoses =
      await listPatientPrimaryDiagnosesService.execute(payload);

    return response.json(patientPrimaryDiagnoses);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPatientPrimaryDiagnosisService = container.resolve(
      CreatePatientPrimaryDiagnosisService,
    );

    const primaryDiagnosis = await createPatientPrimaryDiagnosisService.execute(
      payload,
    );

    return response.json(primaryDiagnosis);
  }
}
