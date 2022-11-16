import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllSpecialtiesService } from '../services/find-all-specialties';

export class SpecialtiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllSpecialtiesService = container.resolve(
      FindAllSpecialtiesService,
    );

    const specialties = await findAllSpecialtiesService.execute();

    return response.json(specialties);
  }
}
