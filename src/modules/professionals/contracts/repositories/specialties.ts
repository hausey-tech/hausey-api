import { ProfessionalSpecialty } from '../../entities/professional-specialty';

export interface ISpecialtiesRepository {
  findAll(): Promise<ProfessionalSpecialty[]>;
}
