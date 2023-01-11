import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import {
  FormattedSpecialty,
  groupSpecialtiesByGroup,
} from '../utils/group-specialties-by-group';

@injectable()
export class FindAllProfessionalSpecialtiesService {
  constructor(
    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(): Promise<FormattedSpecialty[]> {
    const specialties = await this.professionalSpecialtiesRepository.findAll();

    const formattedSpecialties = groupSpecialtiesByGroup(specialties);

    return formattedSpecialties;
  }
}
