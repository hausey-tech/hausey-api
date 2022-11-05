import User from '../models/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
