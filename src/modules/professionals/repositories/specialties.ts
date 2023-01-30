import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateSpecialtyDTO } from '../contracts/dtos/create-specialty';
import { ISpecialtiesRepository } from '../contracts/repositories/specialties';
import { Specialty } from '../entities/specialty';

export class SpecialtiesRepository implements ISpecialtiesRepository {
  private ormRepository: Repository<Specialty>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Specialty);
  }

  public async findAll(): Promise<Specialty[]> {
    return this.ormRepository.find({ order: { group: 'ASC' } });
  }

  public async findById(id: string): Promise<Specialty> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async create(specialty: ICreateSpecialtyDTO): Promise<Specialty> {
    return this.ormRepository.create(specialty);
  }

  public async save(specialty: Specialty): Promise<Specialty> {
    return this.ormRepository.save(specialty);
  }

  public async findByMemedId(memedId: number): Promise<Specialty> {
    return this.ormRepository.findOne({ where: { memedId } });
  }
}
