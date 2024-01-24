import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { IMedicalRecordCidsRepository } from '../contracts/repositories/medical-record-cids-repository';
import { MedicalRecordCid } from '../entities/medical-record-cid';

export class MedicalRecordCidsRepository
  implements IMedicalRecordCidsRepository
{
  private ormRepository: Repository<MedicalRecordCid>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(MedicalRecordCid);
  }

  public async create(payload: { cid: string }): Promise<MedicalRecordCid> {
    const medicalRecord = this.ormRepository.create(payload);
    return this.ormRepository.save(medicalRecord);
  }

  public async save(
    medicalRecordCid: MedicalRecordCid,
  ): Promise<MedicalRecordCid> {
    return this.ormRepository.save(medicalRecordCid);
  }
}
