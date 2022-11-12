import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors';
import { IUsersRepository, ICreateUserDTO } from '../contracts';
import { User } from '../entities';

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, payload: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findById(id);

    if (!checkUserExists) {
      throw new AppError(
        'Usuário não encontrado, verifique o id e tente novamente!',
      );
    }

    return this.usersRepository.update(id, payload);
  }
}
