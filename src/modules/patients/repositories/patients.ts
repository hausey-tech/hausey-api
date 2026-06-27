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

  findByName(name: string): Promise<Patient[] | null> {
    return this.ormRepository.find({
      where: {
        name,
      },
    });
  }

  public async findAll(): Promise<Patient[]> {
    return this.ormRepository.find({
      relations: this.relations,
    });
  }

  findAllByIds(ids: string[]): Promise<Patient[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async findBySellerId(sellerId: string): Promise<Patient[]> {
    return this.ormRepository.find({
      where: { sellerId },
      relations: ['plan'],
      select: [
        'id',
        'createdAt',
        'email',
        'name',
        'nipomed',
        'phoneNumber',
        'birthdate',
        'document',
        'planId',
        'region',
        'planExpiresAt',
        'isPro',
      ],
    });
  }

  public async findBySellerIdPaginated(
    sellerId: string,
    skip: number,
    limit: number,
  ): Promise<[Patient[], number]> {
    const [patients, total] = await this.ormRepository.findAndCount({
      where: { sellerId },
      skip,
      take: limit,
      relations: ['plan'],
      select: [
        'id',
        'createdAt',
        'email',
        'name',
        'nipomed',
        'phoneNumber',
        'birthdate',
        'document',
        'planId',
        'region',
        'planExpiresAt',
        'isPro',
      ],
    });

    return [patients, total];
  }

  public async findAllBySellerId(sellerId: string): Promise<Patient[]> {
    const patients = await this.ormRepository.find({
      where: {
        sellerId,
      },
      relations: ['plan'],
      select: [
        'id',
        'createdAt',
        'sellerId',
        'email',
        'name',
        'nipomed',
        'phoneNumber',
        'birthdate',
        'document',
        'planId',
        'region',
        'planExpiresAt',
        'isPro',
      ],
    });
    return patients;
  }

  public async findBySellerIdIsNull(
    skip: number,
    limit: number,
  ): Promise<[Patient[], number]> {
    const [patients, total] = await this.ormRepository.findAndCount({
      where: {
        seller: null,
      },
      skip,
      take: limit,
    });

    return [patients, total];
  }

  public async find(): Promise<Patient[]> {
    return this.ormRepository.find({
      relations: this.relations,
    });
  }

  public async findPaginated(
    skip: number,
    limit: number,
  ): Promise<[Patient[], number]> {
    const [patients, total] = await this.ormRepository.findAndCount({
      relations: this.relations,
      skip,
      take: limit,
    });
    return [patients, total];
  }

  public async findById(id: string): Promise<Patient | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(
    ids: string[],
    skip: number,
    limit: number,
  ): Promise<[Patient[], number]> {
    const [patients, total] = await this.ormRepository.findAndCount({
      where: { id: In(ids) },
      skip,
      take: limit,
      relations: this.relations,
    });

    return [patients, total];
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
      relations: ['address'],
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
    const patient = this.ormRepository.create(payload);
    return patient;
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
