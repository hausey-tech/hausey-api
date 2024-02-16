import { Repository, In } from 'typeorm';

import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { ICreateProfessionalDTO } from '../contracts/dtos/create-professional';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Professional } from '../entities/professional';

export class ProfessionalsRepository implements IProfessionalsRepository {
  private ormRepository: Repository<Professional>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Professional);
    this.relations = ['specialties.specialty'];
  }

  public async find(): Promise<Professional[]> {
    const professionals = this.ormRepository.find({
      relations: this.relations,
    });

    return professionals;
  }

  public async findById(id: string): Promise<Professional | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<Professional[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async findByRoleId(roleId: string): Promise<Professional[]> {
    return this.ormRepository.find({
      where: { roleId },
      relations: this.relations,
    });
  }

  public async findByEmail(email: string): Promise<Professional | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  public async findByDocument(document: string): Promise<Professional | null> {
    return this.ormRepository.findOne({
      where: { document },
      relations: this.relations,
    });
  }

  public async create(
    payload: Omit<ICreateProfessionalDTO, 'specialties'>,
  ): Promise<Professional> {
    return this.ormRepository.create(payload);
  }

  public async save(professional: Professional): Promise<Professional> {
    return this.ormRepository.save(professional);
  }
}
