import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllProfessionalTypesService } from '../services/find-all-professional-types';

export class ProfessionalTypesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllProfessionalTypesService = container.resolve(
      FindAllProfessionalTypesService,
    );

    const professionalTypes = await findAllProfessionalTypesService.execute();

    return response.json(professionalTypes);
  }
}
