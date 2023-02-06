import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import {
  FormattedSpecialty,
  groupSpecialtiesByGroup,
} from '../utils/group-specialties-by-group';

@injectable()
export class FindSpecialtiesService {
  constructor(
    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(available?: string): Promise<FormattedSpecialty[]> {
    if (available === 'true') {
      const professionalSpecialties =
        await this.professionalSpecialtiesRepository.findAll();

      const specialtiesIds = [
        ...new Set(professionalSpecialties.map(p => p.specialtyId)),
      ];

      const specialties = await this.specialtiesRepository.findByIds(
        specialtiesIds,
      );

      return groupSpecialtiesByGroup(specialties);
    }

    const specialties = await this.specialtiesRepository.find();

    return groupSpecialtiesByGroup(specialties);
  }
}
