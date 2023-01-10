import { ProfessionalType } from '../../entities/professional-type';

export interface IProfessionalTypesRepository {
  findAll(): Promise<ProfessionalType[]>;
  findById(id: string): Promise<ProfessionalType>;
  findByName(name: string): Promise<ProfessionalType>;
}
