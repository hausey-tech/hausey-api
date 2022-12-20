import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { Professional } from '../entities/professional';

@injectable()
export class FindProfessionalsService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(payload: {
    specialtyId?: string;
    typeId?: string;
  }): Promise<Professional[]> {
    const { specialtyId, typeId } = payload;

    if (specialtyId) {
      return this.professionalsRepository.findBySpecialtyId(specialtyId);
    }

    if (typeId) {
      return this.professionalsRepository.findByTypeId(typeId);
    }

    return this.professionalsRepository.find();
  }
}
