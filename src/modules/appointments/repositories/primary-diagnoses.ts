import { Repository } from 'typeorm';

import { IPrimaryDiagnosesRepository } from '../contracts/repositories/primary-diagnoses';
import { ICreatePrimaryDiagnosisDTO } from '../contracts/dtos/create-primary-diagnosis';
import { PrimaryDiagnosis } from '../entities/primary-diagnosis';
import { PostgresDataSource } from '../../../shared/typeorm';

export class PrimaryDiagnosesRepository implements IPrimaryDiagnosesRepository {
  private ormRepository: Repository<PrimaryDiagnosis>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PrimaryDiagnosis);
  }

  public async create(
    primaryDiagnosis: ICreatePrimaryDiagnosisDTO,
  ): Promise<PrimaryDiagnosis> {
    return this.ormRepository.create(primaryDiagnosis);
  }

  public async save(
    primaryDiagnosis: PrimaryDiagnosis,
  ): Promise<PrimaryDiagnosis> {
    return this.ormRepository.save(primaryDiagnosis);
  }

  public async update(
    id: string,
    description: string,
  ): Promise<PrimaryDiagnosis> {
    const primaryDiagnosis = await this.findById(id);
    primaryDiagnosis.description = description;
    return this.ormRepository.save(primaryDiagnosis);
  }

  public async findById(id: string): Promise<PrimaryDiagnosis> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
