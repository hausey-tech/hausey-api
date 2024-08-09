import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPatientGroupTypesRepository } from '../contracts/repositories/patient-group-types';
import { PatientGroupType } from '../entities/patient-group-type';
import { ICreatePatientGroupTypeDto } from '../contracts/dtos/create-patient-group-type';

export class PatientGroupTypesRepository
  implements IPatientGroupTypesRepository
{
  private ormRepository: Repository<PatientGroupType>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientGroupType);
    this.relations = ['patientGroup', 'grouptype'];
  }

  public async find(): Promise<PatientGroupType[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<PatientGroupType | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<PatientGroupType[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async findByGroupTypeIds(ids: string[]): Promise<PatientGroupType[]> {
    return this.ormRepository.find({
      where: { groupTypeId: In(ids) },
      relations: this.relations,
    });
  }

  public async create(
    payload: ICreatePatientGroupTypeDto,
  ): Promise<PatientGroupType> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: PatientGroupType): Promise<PatientGroupType> {
    return this.ormRepository.save(patient);
  }

  public async delete(patientGroupTypeId: string): Promise<void> {
    await this.ormRepository.delete(patientGroupTypeId);
  }
}
