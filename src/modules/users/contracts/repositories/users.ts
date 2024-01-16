import { User } from '../../entities/user';
import { ICreateUserDTO } from '../dtos/create-user';
import { IUpdateUserDTO } from '../dtos/update-user';

export interface IUsersRepository {
  find(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithDeleted(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  restore(id: string, payload: ICreateUserDTO): Promise<User>;
  create(payload: ICreateUserDTO): Promise<User>;
  save(patient: User): Promise<User>;
  update(id: string, payload: IUpdateUserDTO): Promise<User>;
}
