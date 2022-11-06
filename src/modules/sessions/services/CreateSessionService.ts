import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';
import authConfig from '../../../config/auth';
import IHashProvider from '../../../shared/providers/HashProvider/models/IHashProvider';

import User from '../../users/models/User';
import IUsersRepository from '../../users/repositories/IUsersRepository';
import ICreateSessionDTO from '../dtos/ICreateSessionDTO';

interface IResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: ICreateSessionDTO): Promise<IResponse> {
    const { email, password } = payload;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('E-mail ou senha inválido(s)!', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('E-mail ou senha inválido(s)!', 401);
    }

    const { secret, expiresIn, refreshExpiresIn } = authConfig.jwt;

    const accessToken = sign({ id: user.id }, secret, {
      expiresIn,
    });
    const refreshToken = sign({ id: user.id }, secret, {
      expiresIn: refreshExpiresIn,
    });

    delete user.password;

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

export default CreateSessionService;
