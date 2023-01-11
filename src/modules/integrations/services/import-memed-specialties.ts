import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { memedInstance } from '../utils/memed-instance';
import { IProfessionalTypesRepository } from '../../professionals/contracts/repositories/professional-types';
import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { CreateSpecialtyDTO } from '../../professionals/contracts/dtos/create-specialty';

@injectable()
export class ImportMemedSpecialties {
  constructor(
    @inject('ProfessionalTypesRepository')
    private professionalTypesRepository: IProfessionalTypesRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(): Promise<any> {
    const { data } = await memedInstance.get(`/especialidades`);

    const specialties = data.data;
    const professionalTypeName = 'Médico';

    const professionalType = await this.professionalTypesRepository.findByName(
      professionalTypeName,
    );

    if (!professionalType) {
      throw new AppError(
        `Tipo de profissional "${professionalTypeName}" não encontrado!`,
      );
    }

    const formattedSpecialties: CreateSpecialtyDTO[] = specialties.map(
      (specialty: any) => ({
        memedId: specialty.id,
        group: specialty.attributes.grupo,
        name: specialty.attributes.nome,
        professionalTypeId: professionalType.id,
      }),
    );

    const filteredSpecialties = await Promise.all(
      formattedSpecialties.map(async (specialty: any) => {
        if (
          await this.professionalSpecialtiesRepository.findByMemedId(
            specialty.memedId,
          )
        ) {
          return null;
        }
        return specialty;
      }),
    );

    const validSpecialties = filteredSpecialties.filter(
      specialty => specialty !== null,
    );

    const createdSpecialties = await Promise.all(
      validSpecialties.map(async specialty => {
        return this.professionalSpecialtiesRepository.save(
          await this.professionalSpecialtiesRepository.create(specialty),
        );
      }),
    );

    return createdSpecialties;
  }
}
