import { ProfessionalSpecialty } from '../../entities';

export interface ISpecialtiesRepository {
  findAll(): Promise<ProfessionalSpecialty[]>;
}
