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
    console.log(regions);
    const regionsArr = regions?.split(',');
    console.log('regionsArr', regionsArr);
    console.log('regionsArr', regionsArr?.length > 0);
    console.log('regions in', { region: In(regionsArr) });
    const plans = await this.plansRepository.find({
      regions: regionsArr?.length > 0 ? { region: In(regionsArr) } : undefined,
    });
    return plans;
  }
}
