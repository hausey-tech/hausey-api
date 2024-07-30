import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindSpecialtiesService } from '../services/find-specialties';

export class SpecialtiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { available, grouped } = request.query;

    const findSpecialtiesService = container.resolve(FindSpecialtiesService);

    const specialties = await findSpecialtiesService.execute(
      available as string,
      grouped as string,
    );

    return response.json(specialties);
  }
}
