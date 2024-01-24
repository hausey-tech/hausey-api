import { injectable, inject } from 'tsyringe';

import { IClinicalCategorysRepository } from '../contracts/repositories/clinical-categories';
import { ClinicalCategory } from '../entities/clinical-category';

@injectable()
export class FindClinicalCategories {
  constructor(
    @inject('ClinicalCategoryRepository')
    private clinicalCategoryRepository: IClinicalCategorysRepository,
  ) {}

  public async execute(): Promise<ClinicalCategory[]> {
    const roles = await this.clinicalCategoryRepository.findAll();

    return roles;
  }
}
