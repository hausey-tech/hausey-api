import { injectable, inject } from 'tsyringe';
import { IClinicalCategorysRepository } from '../contracts/repositories/clinical-categories';
import { ClinicalCategory } from '../entities/clinical-category';
import { ICreateClinicalCategoryDto } from '../contracts/dtos/create-clinical-category';

@injectable()
export class CreateClinicalCategory {
  constructor(
    @inject('ClinicalCategoryRepository')
    private clinicalCategoryRepository: IClinicalCategorysRepository,
  ) {}

  public async execute({
    name,
    description,
    roleId,
  }: ICreateClinicalCategoryDto): Promise<ClinicalCategory> {
    // const planExists = await this.groupTypesRepository.f(name);

    // if (planExists) {
    //   throw new AppError('Já existe um plano com esse nome!');
    // }

    const groupType = await this.clinicalCategoryRepository.create({
      name,
      description,
      roleId,
    });

    return this.clinicalCategoryRepository.save(groupType);
  }
}
