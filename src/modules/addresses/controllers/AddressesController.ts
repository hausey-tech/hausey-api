import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAddressService } from '../services/CreateAddressService';

export class AddressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createAddressService = container.resolve(CreateAddressService);

    const address = await createAddressService.execute(payload);

    return response.json(address);
  }
}
