import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserAndProfessionalService } from '../services/create-user-and-professional';

export class ProfessionalsController {
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
