import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPlanProfessionalTypeDiscountsRepository } from '../contracts/repositories/plan-professional-type-discounts';
import { PlanProfessionalTypeDiscount } from '../entities/plan-professional-type-discount';

export class PlanProfessionalTypeDiscountsRepository
  implements IPlanProfessionalTypeDiscountsRepository
{
  private ormRepository: Repository<PlanProfessionalTypeDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      PlanProfessionalTypeDiscount,
    );
  }

  public async findByPlanIdAndProfessionalTypeId(
    planId: string,
    professionalTypeId: string,
  ): Promise<PlanProfessionalTypeDiscount> {
    const planTypeDiscount = await this.ormRepository.findOne({
      where: { planId, professionalTypeId },
    });
    return planTypeDiscount;
  }
}
