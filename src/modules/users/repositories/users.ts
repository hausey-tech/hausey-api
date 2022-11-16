import { Repository } from 'typeorm';

import { IUsersRepository } from '../contracts/repositories/users';
import { ICreateUserDTO } from '../contracts/dtos/create-user';
import { PostgresDataSource } from '../../../shared/typeorm';
import { User } from '../entities/user';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(User);
  }

  public async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findByEmailWithDeleted(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email }, withDeleted: true });
  }

  public async restore(id: string, payload: ICreateUserDTO): Promise<User> {
    await this.ormRepository.restore(id);
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async update(id: string, payload: ICreateUserDTO): Promise<User> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async create(payload: ICreateUserDTO): Promise<User> {
    return this.ormRepository.create(payload);
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
