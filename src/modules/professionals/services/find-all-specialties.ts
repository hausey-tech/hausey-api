import { injectable, inject } from 'tsyringe';

import { ISpecialtiesRepository } from '../contracts';
import { ProfessionalSpecialty } from '../entities';

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
