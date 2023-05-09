import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindAllPlans } from '../services/find-all-plans';
import { CreatePlan } from '../services/create-plan';

export class PlansController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllPlansService = container.resolve(FindAllPlans);

    const plans = await findAllPlansService.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, price } = request.body;

    const createPlanService = container.resolve(CreatePlan);

    const plan = await createPlanService.execute({ name, description, price });

    return response.json(plan);
  }
}
