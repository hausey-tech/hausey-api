import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { PatientProfessionalAssistance } from '../entities/patient-professional-assistance';
import { IPatientProfessionalAssistancesRepository } from '../contracts/repositories/patient-professional-assistances';
import { ICreatePatientProfessionalAssistanceDto } from '../contracts/dtos/create-patient-professional-assistance';

export class PatientProfessionalAssistancesRepository
  implements IPatientProfessionalAssistancesRepository
{
  private ormRepository: Repository<PatientProfessionalAssistance>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      PatientProfessionalAssistance,
    );
    this.relations = [
      'plan',
      'address',
      'patientProfessionalAssistances',
      'clinicalResume',
      'patientGroups',
    ];
  }

  public async find(): Promise<PatientProfessionalAssistance[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(
    id: string,
  ): Promise<PatientProfessionalAssistance | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(
    ids: string[],
  ): Promise<PatientProfessionalAssistance[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async create(
    payload: ICreatePatientProfessionalAssistanceDto,
  ): Promise<PatientProfessionalAssistance> {
    return this.ormRepository.create(payload);
  }

  public async save(
    patient: PatientProfessionalAssistance,
  ): Promise<PatientProfessionalAssistance> {
    return this.ormRepository.save(patient);
  }
}
