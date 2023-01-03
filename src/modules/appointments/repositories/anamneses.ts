import { Repository } from 'typeorm';

import { IAnamnesesRepository } from '../contracts/repositories/anamneses';
import { ICreateAnamnesisDTO } from '../contracts/dtos/create-anamnesis';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Anamnesis } from '../entities/anamnesis';

export class AnamnesesRepository implements IAnamnesesRepository {
  private ormRepository: Repository<Anamnesis>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Anamnesis);
  }

  public async create(anamnesis: ICreateAnamnesisDTO): Promise<Anamnesis> {
    return this.ormRepository.create(anamnesis);
  }

  public async save(anamnesis: Anamnesis): Promise<Anamnesis> {
    return this.ormRepository.save(anamnesis);
  }

  public async update(id: string, description: string): Promise<Anamnesis> {
    const anamnesis = await this.findById(id);
    anamnesis.description = description;
    return this.ormRepository.save(anamnesis);
  }

  public async findById(id: string): Promise<Anamnesis> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
