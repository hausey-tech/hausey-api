import { Request, Response } from 'express';
import { container, inject } from 'tsyringe';
import { Logger } from 'pino';
import { FindPlans } from '../services/find-plans';
import { CreatePlanService } from '../services/create-plan-service';

export class PlansController {
  constructor(
    @inject('Logger')
    private logger: Logger,
  ) {}

  public async index(request: Request, response: Response): Promise<Response> {
    const { regions } = request.query;
    this.logger.info(
      {
        region: regions,
      },
      'Região informada pelo usuário',
    );
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
