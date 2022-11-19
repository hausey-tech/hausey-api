import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProgramProfessionalSpecialtyDiscountsRepository } from '../contracts/repositories/program-professional-specialty-discounts';
import { ProgramProfessionalSpecialtyDiscount } from '../entities/program-professional-specialty-discount';

export class ProgramProfessionalSpecialtyDiscountsRepository
  implements IProgramProfessionalSpecialtyDiscountsRepository
{
  private ormRepository: Repository<ProgramProfessionalSpecialtyDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProgramProfessionalSpecialtyDiscount,
    );
  }

  public async findByProgramIdAndProfessionalSpecialtyId(
    programId: string,
    professionalSpecialtyId: string,
  ): Promise<ProgramProfessionalSpecialtyDiscount> {
    const programSpecialtyDiscount = await this.ormRepository.findOne({
      where: { programId, professionalSpecialtyId },
    });
    return programSpecialtyDiscount;
  }
}
