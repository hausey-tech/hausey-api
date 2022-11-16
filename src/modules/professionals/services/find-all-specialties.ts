import { injectable, inject } from 'tsyringe';

import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

@injectable()
export class FindAllSpecialtiesService {
  constructor(
    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,
  ) {}

  public async execute(): Promise<ProfessionalSpecialty[]> {
    const specialties = await this.specialtiesRepository.findAll();

    return specialties;
  }
}
