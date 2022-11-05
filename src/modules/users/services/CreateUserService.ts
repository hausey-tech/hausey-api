import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import AppError from '../../../shared/errors/AppError';
import User from '../models/User';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(payload: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(
      payload.email,
    );

    if (checkUserExists) {
      throw new AppError('Já existe um usuário com este email!');
    }

    const user = await this.usersRepository.create(payload);

    return this.usersRepository.save(user);
  }
}

export default CreateUserService;
