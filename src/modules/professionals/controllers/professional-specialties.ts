import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllProfessionalSpecialtiesService } from '../services/find-all-professional-specialties';

export class ProfessionalSpecialtiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllProfessionalSpecialtiesService = container.resolve(
      FindAllProfessionalSpecialtiesService,
    );

    const professionalSpecialties =
      await findAllProfessionalSpecialtiesService.execute();

    return response.json(professionalSpecialties);
  }
}
