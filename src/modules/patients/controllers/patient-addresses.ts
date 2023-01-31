import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientAddressService } from '../services/create-patient-address';

export class PatientAddressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.params;
    const payload = request.body;

    const createPatientAddressService = container.resolve(
      CreatePatientAddressService,
    );

    const address = await createPatientAddressService.execute({
      patientId,
      ...payload,
    });

    return response.json(address);
  }
}
