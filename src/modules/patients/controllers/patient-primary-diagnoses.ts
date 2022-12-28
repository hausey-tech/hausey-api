import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientPrimaryDiagnosisService } from '../services/create-patient-primary-diagnosis';

export class PatientPrimaryDiagnosesController {
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
