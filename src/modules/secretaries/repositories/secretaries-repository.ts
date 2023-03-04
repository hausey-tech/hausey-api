import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ISecretariesRepository } from '../contracts/repositories/i-secretaries-repository';
import { Secretary } from '../entities/secretary';

export class SecretariesRepository implements ISecretariesRepository {
  private ormRepository: Repository<Secretary>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Secretary);
  }

  public async find(): Promise<Secretary[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Secretary | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async findByEmail(email: string): Promise<Secretary | null> {
    return this.ormRepository.findOne({
      where: { email },
    });
  }
}
