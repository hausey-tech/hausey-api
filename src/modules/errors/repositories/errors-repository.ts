import { type Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { IErrorsRepository } from '../contracts/repositories/errors-repository';
import { Error } from '../entities/error-entity';
import { ICreateErrorDTO } from '../contracts/dtos/create-error-dto';

export class ErrorsRepository implements IErrorsRepository {
  private readonly ormRepository: Repository<Error>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Error);
  }

  public async create(payload: ICreateErrorDTO): Promise<Error> {
    const error = this.ormRepository.create(payload);
    return this.ormRepository.save(error);
  }

  public async save(error: Error): Promise<Error> {
    return this.ormRepository.save(error);
  }
}
