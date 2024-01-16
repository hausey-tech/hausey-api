import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindAllRoles } from '../services/find-all-roles';
import { CreateRole } from '../services/create-role';

export class RolesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllPlansService = container.resolve(FindAllRoles);

    const plans = await findAllPlansService.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, title, type } = request.body;

    const createPlanService = container.resolve(CreateRole);

    const plan = await createPlanService.execute({ name, title, type });

    return response.json(plan);
  }
}
