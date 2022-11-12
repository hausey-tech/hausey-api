import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors';
import { IUsersRepository } from '../contracts';
import { User } from '../entities';

@injectable()
export class FindUserByIdService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError(
        'Usuário não encontrado, verifique o id e tente novamente!',
      );
    }

    return user;
  }
}
