import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors';
import { IUsersRepository } from '../contracts';

@injectable()
export class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const checkUserExists = await this.usersRepository.findById(id);

    if (!checkUserExists) {
      throw new AppError(
        'Usuário não encontrado, verifique e tente novamente!',
      );
    }

    await this.usersRepository.softDelete(id);
  }
}
