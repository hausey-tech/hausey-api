import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../models/User';
import AppError from '../../../shared/errors/AppError';

@injectable()
class FindByIdService {
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

export default FindByIdService;
