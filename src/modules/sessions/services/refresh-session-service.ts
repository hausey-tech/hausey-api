import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { authConfig } from '../../../config/auth';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Professional } from '../../professionals/entities/professional';

import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { Patient } from '../../patients/entities/patient';

import { IUsersRepository } from '../../users/contracts/repositories/users';
import { User } from '../../users/entities/user';
import { IRefreshSessionDTO } from '../contracts/dtos/refresh-session-dto';

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
export class RefreshSessionService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, role }: IRefreshSessionDTO): Promise<IResponse> {
    let data: IRoles;

    switch (role) {
      case 'professional':
        data = {
          professional: await this.professionalsRepository.findById(id),
        };

        if (!data.professional) {
          throw new AppError('Erro ao atualizar sessão!');
        }

        break;

      case 'patient':
        data = { patient: await this.patientsRepository.findById(id) };

        if (!data.patient) {
          throw new AppError('Erro ao atualizar sessão!');
        }

        break;

      case 'manager':
        data = {
          user: await this.usersRepository.findById(id),
        };

        if (!data.user) {
          throw new AppError('Erro ao atualizar sessão!');
        }

        break;

      default:
        throw new AppError('Erro ao atualizar sessão!');
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
