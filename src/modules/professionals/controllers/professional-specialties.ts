import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllProfessionalSpecialtiesService } from '../services/find-all-professional-specialties';
import { FindProfessionalSpecialtiesByProfessionalTypeService } from '../services/find-professional-specialties-by-professional-type';

export class ProfessionalSpecialtiesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllProfessionalSpecialtiesService = container.resolve(
      FindAllProfessionalSpecialtiesService,
    );

    const professionalSpecialties =
      await findAllProfessionalSpecialtiesService.execute();

    return response.json(professionalSpecialties);
  }

  public async indexByProfessionalType(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { professionalTypeId } = request.params;
    const findSpecialtiesByTypeService = container.resolve(
      FindProfessionalSpecialtiesByProfessionalTypeService,
    );

    const specialties = await findSpecialtiesByTypeService.execute(
      professionalTypeId,
    );

    return response.json(specialties);
  }
}
