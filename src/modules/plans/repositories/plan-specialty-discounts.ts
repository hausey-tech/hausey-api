import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPlanSpecialtyDiscountsRepository } from '../contracts/repositories/plan-specialty-discounts';
import { PlanSpecialtyDiscount } from '../entities/plan-specialty-discount';

export class PlanSpecialtyDiscountsRepository
  implements IPlanSpecialtyDiscountsRepository
{
  private ormRepository: Repository<PlanSpecialtyDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      PlanSpecialtyDiscount,
    );
  }

  public async findByPlanIdAndSpecialtyId(
    planId: string,
    specialtyId: string,
  ): Promise<PlanSpecialtyDiscount> {
    const planSpecialtyDiscount = await this.ormRepository.findOne({
      where: { planId, specialtyId },
    });
    return planSpecialtyDiscount;
  }
}
