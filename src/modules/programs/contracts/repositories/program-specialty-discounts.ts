import { ProgramSpecialtyDiscount } from '../../entities/program-specialty-discount';

export interface IProgramSpecialtyDiscountsRepository {
  findByProgramIdAndSpecialtyId(
    programId: string,
    specialtyId: string,
  ): Promise<ProgramSpecialtyDiscount>;
}
