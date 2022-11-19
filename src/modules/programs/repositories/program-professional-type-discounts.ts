import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProgramProfessionalTypeDiscountsRepository } from '../contracts/repositories/program-professional-type-discounts';
import { ProgramProfessionalTypeDiscount } from '../entities/program-professional-type-discount';

export class ProgramProfessionalTypeDiscountsRepository
  implements IProgramProfessionalTypeDiscountsRepository
{
  private ormRepository: Repository<ProgramProfessionalTypeDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProgramProfessionalTypeDiscount,
    );
  }

  public async findByProgramIdAndProfessionalTypeId(
    programId: string,
    professionalTypeId: string,
  ): Promise<ProgramProfessionalTypeDiscount> {
    const programTypeDiscount = await this.ormRepository.findOne({
      where: { programId, professionalTypeId },
    });
    return programTypeDiscount;
  }
}
