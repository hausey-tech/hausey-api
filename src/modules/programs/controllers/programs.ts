import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllPrograms } from '../services/find-all-programs';

export class ProgramsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllProgramsService = container.resolve(FindAllPrograms);

    const programs = await findAllProgramsService.execute();

    return response.json(programs);
  }
}
