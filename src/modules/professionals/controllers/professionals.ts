import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserAndProfessionalService } from '../services/create-professional';
import { FindProfessionalsService } from '../services/find-professionals';

export class ProfessionalsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const payload = request.query;

    const findProfessionalsService = container.resolve(
      FindProfessionalsService,
    );

    const professionals = await findProfessionalsService.execute(payload);

    return response.json(professionals);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserAndProfessionalService = container.resolve(
      CreateUserAndProfessionalService,
    );

    const professional = await createUserAndProfessionalService.execute(
      payload,
    );

    return response.json(professional);
  }
}
