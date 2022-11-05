import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/database';
import IUsersRepository from './IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../models/User';

class UsersRepository implements IUsersRepository {
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

  public async create(payload: ICreateUserDTO): Promise<User> {
    return this.ormRepository.create(payload);
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
