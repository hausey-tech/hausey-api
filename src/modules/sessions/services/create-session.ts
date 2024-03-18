import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { AppError } from '../../../shared/errors/app-error';
import { authConfig } from '../../../config/auth';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Professional } from '../../professionals/entities/professional';

import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { Patient } from '../../patients/entities/patient';

import { ICreateSessionDTO } from '../contracts/dtos/create-session';
import { IUsersRepository } from '../../users/contracts/repositories/users';
import { User } from '../../users/entities/user';

interface IRoles {
  professional?: Professional;
  patient?: Patient;
  user?: User;
}
interface IResponse extends IRoles {
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class CreateSessionService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: ICreateSessionDTO): Promise<IResponse> {
    const { email, password, role } = payload;

    let data: IRoles;
    let id: string;
    let passwordMatched: boolean;

    switch (role) {
      case 'professional':
        data = {
          professional: await this.professionalsRepository.findByEmail(email),
        };

        if (!data.professional) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        if (!data.professional.password) {
          throw new AppError('Este usuário não possui senha cadastrada!');
        }

        passwordMatched = await this.hashProvider.compareHash(
          password,
          data.professional.password,
        );

        if (!passwordMatched) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        id = data.professional.id;

        break;

      case 'patient':
        data = { patient: await this.patientsRepository.findByEmail(email) };

        if (!data.patient) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        if (!data.patient.password) {
          throw new AppError('Este usuário não possui senha cadastrada!');
        }

        passwordMatched = await this.hashProvider.compareHash(
          password,
          data.patient.password,
        );

        if (!passwordMatched) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        id = data.patient.id;

        break;

      case 'manager':
        data = {
          user: await this.usersRepository.findByEmail(email),
        };

        if (!data.user) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        if (!data.user.password) {
          throw new AppError('Este usuário não possui senha cadastrada!');
        }

        passwordMatched = await this.hashProvider.compareHash(
          password,
          data.user.password,
        );

        if (!passwordMatched) {
          throw new AppError('E-mail ou senha inválido(s)!');
        }

        id = data.user.id;

        break;

      default:
        throw new AppError('Informe a função do usuário para efetuar o login!');
    }

    const { secret, expiresIn, refreshExpiresIn } = authConfig.jwt;

    const accessToken = sign({ id, role }, secret, {
      expiresIn,
    });

    const refreshToken = sign({ id, role }, secret, {
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      ...data,
    };
  }
}
