import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '../contracts/repositories/users';
import { ICreateUserDTO } from '../contracts/dtos/create-user';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { AppError } from '../../../shared/errors/app-error';
import { User } from '../entities/user';

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: ICreateUserDTO): Promise<User> {
    const { email, password } = payload;

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Já existe um usuário com este email, faça o login!');
    }

    const checkUserDeleted = await this.usersRepository.findByEmailWithDeleted(
      email,
    );

    const hashedPassword = password
      ? await this.hashProvider.generateHash(password)
      : undefined;

    if (checkUserDeleted) {
      return this.usersRepository.restore(checkUserDeleted.id, {
        ...payload,
        password: hashedPassword,
      });
    }

    const user = await this.usersRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
