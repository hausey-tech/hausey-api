import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAvailableSpecialtiesService } from '../services/find-available-specialties';

export class SpecialtiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAvailableSpecialtiesService = container.resolve(
      FindAvailableSpecialtiesService,
    );

    const specialties = await findAvailableSpecialtiesService.execute();

    return response.json(specialties);
  }
}
