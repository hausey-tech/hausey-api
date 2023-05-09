import { injectable, inject } from 'tsyringe';

import { IPlansRepository } from '../contracts/repositories/plans';
import { Plan } from '../entities/plan';

@injectable()
export class FindAllPlans {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute(): Promise<Plan[]> {
    const plans = await this.plansRepository.findAll();

    return plans;
  }
}
