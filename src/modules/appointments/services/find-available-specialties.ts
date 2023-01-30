import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { ISpecialtiesRepository } from '../../professionals/contracts/repositories/specialties';
import {
  groupSpecialtiesByGroup,
  FormattedSpecialty,
} from '../../professionals/utils/group-specialties-by-group';

@injectable()
export class FindAvailableSpecialtiesService {
  constructor(
    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiessRepository: IProfessionalSpecialtiesRepository,

    @inject('SpecialtiesRepository')
    private specialtiessRepository: ISpecialtiesRepository,
  ) {}

  public async execute(): Promise<FormattedSpecialty[]> {
    const professionalSpecialties =
      await this.professionalSpecialtiessRepository.findAll();

    const specialtiesIds = [
      ...new Set(professionalSpecialties.map(p => p.specialtyId)),
    ];

    const specialties = await this.specialtiessRepository.findByIds(
      specialtiesIds,
    );

    return groupSpecialtiesByGroup(specialties);
  }
}
