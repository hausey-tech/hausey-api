import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import AppError from '../../../shared/errors/AppError';
import User from '../models/User';

@injectable()
class UpdateUserService {
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

export default UpdateUserService;
