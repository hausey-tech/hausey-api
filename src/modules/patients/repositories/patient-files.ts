import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { PatientFiles } from '../entities/patient-files';
import { ICreatePatientFileDto } from '../contracts/dtos/create-patient-file';
import { IPatientFilesRepository } from '../contracts/repositories/patient-files';

export class PatientFilesRepository implements IPatientFilesRepository {
  private ormRepository: Repository<PatientFiles>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientFiles);
    this.relations = ['patient', 'patient_files'];
  }

  public async find(): Promise<PatientFiles[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<PatientFiles | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByPatientId(patientId: string): Promise<PatientFiles[]> {
    return this.ormRepository.find({
      where: { patientId },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<PatientFiles[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async create(payload: ICreatePatientFileDto): Promise<PatientFiles> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: PatientFiles): Promise<PatientFiles> {
    return this.ormRepository.save(patient);
  }
}
