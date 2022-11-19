import { PlanProfessionalTypeDiscount } from '../../entities/plan-professional-type-discount';

export interface IPlanProfessionalTypeDiscountsRepository {
  findByPlanIdAndProfessionalTypeId(
    planId: string,
    professionalTypeId: string,
  ): Promise<PlanProfessionalTypeDiscount>;
}
