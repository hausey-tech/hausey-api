import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '../../../shared/errors/AppError';

@injectable()
class DeleteUserService {
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

export default DeleteUserService;
