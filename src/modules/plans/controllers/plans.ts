import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllPlans } from '../services/find-all-plans';

export class PlansController {
  public async index(request: Request, response: Response): Promise<Response> {
    const findAllPlansService = container.resolve(FindAllPlans);

    const plans = await findAllPlansService.execute();

    return response.json(plans);
  }
}
