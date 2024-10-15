import { injectable, inject } from 'tsyringe';

import { In } from 'typeorm';
import { IPlansRepository } from '../contracts/repositories/plans';
import { Plan } from '../entities/plan';
import { IFindPlansDTO } from '../contracts/dtos/find-plans-dto';

@injectable()
export class FindPlans {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ regions }: IFindPlansDTO): Promise<Plan[]> {
    const regionsArr = regions?.split(',');
    const plans = await this.plansRepository.find({
      regions: regionsArr?.length > 0 ? { region: In(regionsArr) } : undefined,
    });
    return plans;
  }
}
