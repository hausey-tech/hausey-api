import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithDeleted(email: string): Promise<User | null>;
  restore(id: string, payload: ICreateUserDTO): Promise<User>;
  update(id: string, payload: ICreateUserDTO): Promise<User>;
  create(payload: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  softDelete(id: string): Promise<void>;
}
