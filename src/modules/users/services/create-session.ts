import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { AppError } from '../../../shared/errors/app-error';
import { authConfig } from '../../../config/auth';
import { User } from '../entities/user';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Professional } from '../../professionals/entities/professional';

import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { Patient } from '../../patients/entities/patient';

import { IUsersRepository } from '../contracts/repositories/users';
import { ICreateSessionDTO } from '../contracts/dtos/create-session';

interface IRoles {
  professional?: Professional;
  patient?: Patient;
  user?: User;
  manager?: Record<string, unknown>;
}
interface IResponse extends IRoles {
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(payload: ICreateSessionDTO): Promise<IResponse> {
    const { email, password, role } = payload;

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

    let data: IRoles;

    switch (role) {
      case 'professional':
        data = {
          professional: await this.professionalsRepository.findByUserId(
            user.id,
          ),
        };

        if (!data.professional) {
          throw new AppError(
            'Não há nenhum profissional vinculado a este usuário!',
          );
        }
        break;

      case 'patient':
        data = {
          patient: await this.patientsRepository.findByUserId(user.id),
        };

        if (!data.patient) {
          throw new AppError(
            'Não há nenhum paciente vinculado a este usuário!',
          );
        }
        break;

      case 'manager':
        data = {
          manager: {},
        };
        break;

      default:
        data = {
          user,
        };
        break;
    }

    return {
      accessToken,
      refreshToken,
      ...data,
    };
  }
}
