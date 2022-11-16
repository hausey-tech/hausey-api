import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { CreateUserService } from '../../../../src/modules/users/services/create-user';
import { UsersRepository } from '../repositories/users';
import { HashProvider } from '../../../shared/providers/hash-provider';
import { User } from '../../../../src/modules/users/entities/user';
import { makeFakeDb } from '../../../typeorm';
import { AppError } from '../../../../src/shared/errors/app-error';

describe('CreateUser Service', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await makeFakeDb([User]);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  const makeSut = () => {
    const hashProvider = new HashProvider();
    const usersRepository = new UsersRepository(dataSource);
    const sut = new CreateUserService(usersRepository, hashProvider);

    return { sut, usersRepository, hashProvider };
  };

  it('should throw an error if email already exists', async () => {
    const { sut, usersRepository } = makeSut();
    const userPayload = {
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'valid_password',
    };
    const user = await sut.execute(userPayload);

    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(user)));

    const promise = sut.execute(userPayload);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('should throw if HashProvider throws', async () => {
    const { sut, hashProvider } = makeSut();
    jest.spyOn(hashProvider, 'generateHash').mockImplementationOnce(() => {
      throw new Error();
    });
    const userPayload = {
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'valid_password',
    };

    const promise = sut.execute(userPayload);

    await expect(promise).rejects.toThrow();
  });

  it('should return an user on success', async () => {
    const { sut } = makeSut();
    const userPayload = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const user = await sut.execute(userPayload);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'valid_name');
    expect(user).toHaveProperty('email', 'valid_email@mail.com');
    expect(user).toHaveProperty('password', 'hash');
  });
});
