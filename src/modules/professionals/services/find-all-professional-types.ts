import { injectable, inject } from 'tsyringe';

import { IProfessionalTypesRepository } from '../contracts/repositories/professional-types';
import { ProfessionalType } from '../entities/professional-type';

@injectable()
export class FindAllProfessionalTypesService {
  constructor(
    @inject('ProfessionalTypesRepository')
    private professionalTypesRepository: IProfessionalTypesRepository,
  ) {}

  public async execute(): Promise<ProfessionalType[]> {
    return this.professionalTypesRepository.findAll();
  }
}
