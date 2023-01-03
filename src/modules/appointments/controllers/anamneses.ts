import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAnamnesisService } from '../services/create-anamnesis';
import { UpdateAnamnesisService } from '../services/update-anamnesis';

export class AnamnesesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createAnamnesisService = container.resolve(CreateAnamnesisService);

    const anamnesis = await createAnamnesisService.execute(payload);

    return response.json(anamnesis);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const updateAnamnesisService = container.resolve(UpdateAnamnesisService);

    const anamnesis = await updateAnamnesisService.execute(payload);

    return response.json(anamnesis);
  }
}
