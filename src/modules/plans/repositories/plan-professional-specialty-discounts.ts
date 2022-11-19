import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPlanProfessionalSpecialtyDiscountsRepository } from '../contracts/repositories/plan-professional-specialty-discounts';
import { PlanProfessionalSpecialtyDiscount } from '../entities/plan-professional-specialty-discount';

export class PlanProfessionalSpecialtyDiscountsRepository
  implements IPlanProfessionalSpecialtyDiscountsRepository
{
  private ormRepository: Repository<PlanProfessionalSpecialtyDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      PlanProfessionalSpecialtyDiscount,
    );
  }

  public async findByPlanIdAndProfessionalSpecialtyId(
    planId: string,
    professionalSpecialtyId: string,
  ): Promise<PlanProfessionalSpecialtyDiscount> {
    const planSpecialtyDiscount = await this.ormRepository.findOne({
      where: { planId, professionalSpecialtyId },
    });
    return planSpecialtyDiscount;
  }
}
