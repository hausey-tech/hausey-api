import { ProgramProfessionalSpecialtyDiscount } from '../../entities/program-professional-specialty-discount';

export interface IProgramProfessionalSpecialtyDiscountsRepository {
  findByProgramIdAndProfessionalSpecialtyId(
    programId: string,
    professionalSpecialtyId: string,
  ): Promise<ProgramProfessionalSpecialtyDiscount>;
}
