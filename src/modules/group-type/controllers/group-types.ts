import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindGroupTypes } from '../services/find-all-group-types';
import { CreateGroupType } from '../services/create-group-type';

export class GroupTypesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllPlansService = container.resolve(FindGroupTypes);

    const plans = await findAllPlansService.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, roleId } = request.body;

    const createPlanService = container.resolve(CreateGroupType);

    const plan = await createPlanService.execute({ name, description, roleId });

    return response.json(plan);
  }
}
