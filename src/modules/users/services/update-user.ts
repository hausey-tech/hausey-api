import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { IUpdateUserDTO } from '../contracts/dtos/update-user';
import { User } from '../entities/user';

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, payload: IUpdateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findById(id);

    if (!checkUserExists) {
      throw new AppError(
        'Usuário não encontrado, verifique o id e tente novamente!',
      );
    }

    return this.usersRepository.update(id, payload);
  }
}
