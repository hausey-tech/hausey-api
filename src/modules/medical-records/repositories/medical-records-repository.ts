import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IMedicalRecordsRepository } from '../contracts/repositories/medical-records-repository';
import { MedicalRecord } from '../entities/medical-record';

export class MedicalRecordsRepository implements IMedicalRecordsRepository {
  private ormRepository: Repository<MedicalRecord>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(MedicalRecord);
    this.relations = [];
  }

  public async create(payload: {
    description: string;
    restricted?: boolean;
  }): Promise<MedicalRecord> {
    const medicalRecord = this.ormRepository.create(payload);
    return this.ormRepository.save(medicalRecord);
  }

  public async save(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    return this.ormRepository.save(medicalRecord);
  }
}
