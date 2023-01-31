import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateProfessionalAddressService } from '../services/create-professional-address';

export class ProfessionalAddressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { professionalId } = request.params;
    const payload = request.body;

    const createProfessionalAddressService = container.resolve(
      CreateProfessionalAddressService,
    );

    const address = await createProfessionalAddressService.execute({
      professionalId,
      ...payload,
    });

    return response.json(address);
  }
}
