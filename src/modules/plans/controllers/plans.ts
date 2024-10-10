import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPlans } from '../services/find-plans';
import { CreatePlanService } from '../services/create-plan-service';

export class PlansController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { regions } = request.query;
    const findPlansService = container.resolve(FindPlans);
    const plans = await findPlansService.execute({
      regions: regions as string,
    });
    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, price } = request.body;

    const createPlanService = container.resolve(CreatePlanService);

    const plan = await createPlanService.execute({ name, description, price });

    return response.json(plan);
  }
}
