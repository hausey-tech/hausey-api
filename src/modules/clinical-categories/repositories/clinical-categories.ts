import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateClinicalCategoryDto } from '../contracts/dtos/create-clinical-category';
import { ClinicalCategory } from '../entities/clinical-category';
import { IClinicalCategorysRepository } from '../contracts/repositories/clinical-categories';

export class ClinicalCategorysRepository
  implements IClinicalCategorysRepository
{
  private ormRepository: Repository<ClinicalCategory>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(ClinicalCategory);
  }

  public async findAll(): Promise<ClinicalCategory[]> {
    return this.ormRepository.find();
  }

  public async findByName(name: string): Promise<ClinicalCategory | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<ClinicalCategory | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByRoleId(
    roleId: string,
  ): Promise<ClinicalCategory[] | null> {
    return this.ormRepository.find({ where: { roleId } });
  }

  public async create(
    groupType: ICreateClinicalCategoryDto,
  ): Promise<ClinicalCategory> {
    return this.ormRepository.create(groupType);
  }

  public async save(groupType: ClinicalCategory): Promise<ClinicalCategory> {
    return this.ormRepository.save(groupType);
  }
}
