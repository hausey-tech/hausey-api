import { PlanSpecialtyDiscount } from '../../entities/plan-specialty-discount';

export interface IPlanSpecialtyDiscountsRepository {
  findByPlanIdAndSpecialtyId(
    planId: string,
    specialtyId: string,
  ): Promise<PlanSpecialtyDiscount>;
}
