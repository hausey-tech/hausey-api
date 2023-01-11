import { ProfessionalSpecialty } from '../../entities/professional-specialty';
import { CreateSpecialtyDTO } from '../dtos/create-specialty';

export interface IProfessionalSpecialtiesRepository {
  findAll(): Promise<ProfessionalSpecialty[]>;
  findById(id: string): Promise<ProfessionalSpecialty>;
  findByProfessionalTypeId(
    professionalTypeid: string,
  ): Promise<ProfessionalSpecialty[]>;
  create(specialty: CreateSpecialtyDTO): Promise<ProfessionalSpecialty>;
  save(specialty: ProfessionalSpecialty): Promise<ProfessionalSpecialty>;
  findByMemedId(memedId: number): Promise<ProfessionalSpecialty>;
}
