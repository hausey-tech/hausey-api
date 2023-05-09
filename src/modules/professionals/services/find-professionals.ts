import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { Professional } from '../entities/professional';

@injectable()
export class FindProfessionalsService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute(payload: {
    specialtyId?: string;
  }): Promise<Professional[]> {
    const { specialtyId } = payload;

    if (specialtyId) {
      const professionalsSpecialty =
        await this.professionalSpecialtiesRepository.findBySpecialtyId(
          specialtyId,
        );

      const professionalsIds = [
        ...new Set(professionalsSpecialty.map(p => p.professionalId)),
      ];

      return this.professionalsRepository.findByIds(professionalsIds);
    }

    return this.professionalsRepository.find();
  }
}
