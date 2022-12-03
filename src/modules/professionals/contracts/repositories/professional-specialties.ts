import { ProfessionalSpecialty } from '../../entities/professional-specialty';

export interface IProfessionalSpecialtiesRepository {
  findAll(): Promise<ProfessionalSpecialty[]>;
  findById(id: string): Promise<ProfessionalSpecialty>;
  findByProfessionalTypeId(
    professionalTypeid: string,
  ): Promise<ProfessionalSpecialty[]>;
}
