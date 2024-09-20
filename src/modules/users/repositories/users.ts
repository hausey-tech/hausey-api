import { Repository, In } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateUserDTO } from '../contracts/dtos/create-user';
import { IUpdateUserDTO } from '../contracts/dtos/update-user';
import { IUsersRepository } from '../contracts/repositories/users';
import { User } from '../entities/user';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(User);
    this.relations = [
      'role',
      'sellerCode.sellers.seller',
      'sellerCode.discounts.plan',
    ];
  }

  public async find(): Promise<User[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByIds(ids: string[]): Promise<User[]> {
    return this.ormRepository.find({
      where: { id: In(ids) },
      relations: this.relations,
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  public async findByEmailWithDeleted(email: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { email },
      relations: this.relations,
      withDeleted: true,
    });
  }

  public async findByDocument(document: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { document },
      relations: this.relations,
    });
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.ormRepository.findOne({
      where: { phoneNumber },
      relations: this.relations,
    });
  }

  public async restore(id: string, payload: ICreateUserDTO): Promise<User> {
    await this.ormRepository.restore(id);
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async create(payload: ICreateUserDTO): Promise<User> {
    return this.ormRepository.create(payload);
  }

  public async save(patient: User): Promise<User> {
    return this.ormRepository.save(patient);
  }

  public async update(id: string, payload: IUpdateUserDTO): Promise<User> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }
}
