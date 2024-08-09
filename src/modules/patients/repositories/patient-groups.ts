import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { IPatientGroupsRepository } from '../contracts/repositories/patient-groups';
import { PatientGroup } from '../entities/patient-group';
import { ICreatePatientGroupDto } from '../contracts/dtos/create-patient-group';

export class PatientGroupsRepository implements IPatientGroupsRepository {
  private ormRepository: Repository<PatientGroup>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientGroup);
    this.relations = [
      'patient',
      'role',
      'patientGroupTypes',
      'patientGroupTypes.grouptype',
    ];
  }

  public async find(): Promise<PatientGroup[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<PatientGroup | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByPatientId(
    patientId: string,
  ): Promise<PatientGroup[] | null> {
    return this.ormRepository.find({
      where: { patientId },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<PatientGroup[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async create(payload: ICreatePatientGroupDto): Promise<PatientGroup> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: PatientGroup): Promise<PatientGroup> {
    return this.ormRepository.save(patient);
  }

  public async delete(patientGroupId: string): Promise<void> {
    await this.ormRepository.delete(patientGroupId);
  }
}
