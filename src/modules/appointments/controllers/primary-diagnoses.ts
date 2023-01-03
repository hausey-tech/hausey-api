import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePrimaryDiagnosisService } from '../services/create-primary-diagnosis';

export class PrimaryDiagnosesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPrimaryDiagnosisService = container.resolve(
      CreatePrimaryDiagnosisService,
    );

    const primaryDiagnosis = await createPrimaryDiagnosisService.execute(
      payload,
    );

    return response.json(primaryDiagnosis);
  }
}
