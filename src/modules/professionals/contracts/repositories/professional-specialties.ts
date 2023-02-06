import { ProfessionalSpecialty } from '../../entities/professional-specialty';
import { ICreateProfessionalSpecialtyDTO } from '../dtos/create-professional-specialty';

export interface IProfessionalSpecialtiesRepository {
  findAll(): Promise<ProfessionalSpecialty[]>;
  findBySpecialtyId(specialtyId: string): Promise<ProfessionalSpecialty[]>;
  findByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalSpecialty[]>;
  create(
    professionalSpecialty: ICreateProfessionalSpecialtyDTO,
  ): Promise<ProfessionalSpecialty>;
  save(
    professionalSpecialty: ProfessionalSpecialty,
  ): Promise<ProfessionalSpecialty>;
}
