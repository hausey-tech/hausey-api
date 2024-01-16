import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { User } from '../entities/user';

@injectable()
export class GetUserInfos {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(params: { userId?: string }): Promise<User> {
    const { userId } = params;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return user;
  }
}
