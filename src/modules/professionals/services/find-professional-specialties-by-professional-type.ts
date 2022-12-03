import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

@injectable()
export class FindProfessionalSpecialtiesByProfessionalTypeService {
  constructor(
    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(
    professionalTypeId: string,
  ): Promise<ProfessionalSpecialty[]> {
    return this.professionalSpecialtiesRepository.findByProfessionalTypeId(
      professionalTypeId,
    );
  }
}
