import { injectable, inject } from 'tsyringe';

import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import {
  FormattedSpecialty,
  groupSpecialtiesByGroup,
} from '../utils/group-specialties-by-group';

@injectable()
export class FindAllSpecialtiesService {
  constructor(
    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,
  ) {}

  public async execute(): Promise<FormattedSpecialty[]> {
    const specialties = await this.specialtiesRepository.findAll();

    const formattedSpecialties = groupSpecialtiesByGroup(specialties);

    return formattedSpecialties;
  }
}
