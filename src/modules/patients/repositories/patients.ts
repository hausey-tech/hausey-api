import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreatePatientDTO } from '../contracts/dtos/create-patient';
import { IUpdatePatientDTO } from '../contracts/dtos/update-patient';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

export class PatientsRepository implements IPatientsRepository {
  private ormRepository: Repository<Patient>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Patient);
    this.relations = [
      'plan',
      'address',
      'patientProfessionalAssistances',
      'clinicalResume',
      'patientGroups',
      'responsibleTeam',
      'patientGroups.patientGroupTypes',
      'patientGroups.patientGroupTypes.grouptype',
      'seller.sellerCode.discounts',
    ];
  }

  public async find(): Promise<Patient[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<Patient[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async findByEmail(email: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  public async findByEmailWithDeleted(email: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: this.relations,
      withDeleted: true,
    });
  }

  public async findByDocument(document: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { document },
      relations: this.relations,
    });
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { phoneNumber },
      relations: this.relations,
    });
  }

  public async findByCustomerId(customerId: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { stripeCustomerId: customerId },
    });
  }

  public async restore(
    id: string,
    payload: ICreatePatientDTO,
  ): Promise<Patient> {
    await this.ormRepository.restore(id);
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async create(payload: ICreatePatientDTO): Promise<Patient> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: Patient): Promise<Patient> {
    return this.ormRepository.save(patient);
  }

  public async update(
    id: string,
    payload: IUpdatePatientDTO,
  ): Promise<Patient> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }
}
