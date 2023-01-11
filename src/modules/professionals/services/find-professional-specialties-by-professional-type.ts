import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { IProfessionalTypesRepository } from '../contracts/repositories/professional-types';
import { AppError } from '../../../shared/errors/app-error';
import {
  FormattedSpecialty,
  groupSpecialtiesByGroup,
} from '../utils/group-specialties-by-group';

@injectable()
export class FindProfessionalSpecialtiesByProfessionalTypeService {
  constructor(
    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
    @inject('ProfessionalTypesRepository')
    private professionalTypesRepository: IProfessionalTypesRepository,
  ) {}

  public async execute(
    professionalTypeId: string,
  ): Promise<FormattedSpecialty[]> {
    const type = await this.professionalTypesRepository.findById(
      professionalTypeId,
    );

    if (!type) {
      throw new AppError(
        'Tipo de profissional não encontrado, verifique e tente novamente!',
      );
    }

    if (!type.hasSpecialties) {
      throw new AppError('Esse tipo de profissional não tem especialidades!');
    }

    const specialties =
      await this.professionalSpecialtiesRepository.findByProfessionalTypeId(
        professionalTypeId,
      );

    const formattedSpecialty = groupSpecialtiesByGroup(specialties);

    return formattedSpecialty;
  }
}
