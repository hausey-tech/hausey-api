import { ProgramProfessionalTypeDiscount } from '../../entities/program-professional-type-discount';

export interface IProgramProfessionalTypeDiscountsRepository {
  findByProgramIdAndProfessionalTypeId(
    programId: string,
    professionalTypeId: string,
  ): Promise<ProgramProfessionalTypeDiscount>;
}
