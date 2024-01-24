import { ClinicalCategory } from '../../entities/clinical-category';
import { ICreateClinicalCategoryDto } from '../dtos/create-clinical-category';

export interface IClinicalCategorysRepository {
  findAll(): Promise<ClinicalCategory[]>;
  findByName(name: string): Promise<ClinicalCategory | null>;
  findById(id: string): Promise<ClinicalCategory | null>;
  findByRoleId(roleId: string): Promise<ClinicalCategory[] | null>;
  create(payload: ICreateClinicalCategoryDto): Promise<ClinicalCategory>;
  save(patient: ClinicalCategory): Promise<ClinicalCategory>;
}
