import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IProgramSpecialtyDiscountsRepository } from '../contracts/repositories/program-specialty-discounts';
import { ProgramSpecialtyDiscount } from '../entities/program-specialty-discount';

export class ProgramSpecialtyDiscountsRepository
  implements IProgramSpecialtyDiscountsRepository
{
  private ormRepository: Repository<ProgramSpecialtyDiscount>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProgramSpecialtyDiscount,
    );
  }

  public async findByProgramIdAndSpecialtyId(
    programId: string,
    specialtyId: string,
  ): Promise<ProgramSpecialtyDiscount> {
    const programSpecialtyDiscount = await this.ormRepository.findOne({
      where: { programId, specialtyId },
    });
    return programSpecialtyDiscount;
  }
}
