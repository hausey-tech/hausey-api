import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import {
  groupSpecialtiesByGroup,
  FormattedSpecialty,
} from '../../professionals/utils/group-specialties-by-group';

@injectable()
export class FindAvailableSpecialtiesService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(): Promise<FormattedSpecialty[]> {
    const professionals = await this.professionalsRepository.find();

    const specialties = professionals.map(p => p.professionalSpecialty);

    const uniqueSpecialties = specialties.filter((s, i) => {
      return !i || s.id !== specialties[i - 1].id;
    });

    return groupSpecialtiesByGroup(uniqueSpecialties);
  }
}
