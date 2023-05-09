import { injectable, inject } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';
import { ISpecialtiesRepository } from '../../specialties/contracts/repositories/specialties';
import { ICreateSpecialtyDTO } from '../../specialties/contracts/dtos/create-specialty';

@injectable()
export class ImportMemedSpecialties {
  constructor(
    @inject('SpecialtiesRepository')
    private specialtiesRepository: ISpecialtiesRepository,
  ) {}

  public async execute(): Promise<any> {
    const { data } = await memedInstance.get(`/especialidades`);

    const specialties = data.data;

    const formattedSpecialties: ICreateSpecialtyDTO[] = specialties.map(
      (specialty: any) => ({
        memedId: specialty.id,
        group: specialty.attributes.grupo,
        name: specialty.attributes.nome,
      }),
    );

    const filteredSpecialties = await Promise.all(
      formattedSpecialties.map(async (specialty: any) => {
        if (await this.specialtiesRepository.findByMemedId(specialty.memedId)) {
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
        return this.specialtiesRepository.save(
          await this.specialtiesRepository.create(specialty),
        );
      }),
    );

    return createdSpecialties;
  }
}
