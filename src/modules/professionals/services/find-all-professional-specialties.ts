import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

@injectable()
export class FindAllProfessionalSpecialtiesService {
  constructor(
    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(): Promise<ProfessionalSpecialty[]> {
    return this.professionalSpecialtiesRepository.findAll();
  }
}
