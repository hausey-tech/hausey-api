import { PlanProfessionalSpecialtyDiscount } from '../../entities/plan-professional-specialty-discount';

export interface IPlanProfessionalSpecialtyDiscountsRepository {
  findByPlanIdAndProfessionalSpecialtyId(
    planId: string,
    professionalSpecialtyId: string,
  ): Promise<PlanProfessionalSpecialtyDiscount>;
}
