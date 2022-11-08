import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

import Professional from '@modules/professionals/infra/typeorm/entities/Professional';
import Patient from '@modules/patients/infra/typeorm/entities/Patient';

import IHashProvider from '@shared/infra/providers/HashProvider/entities/IHashProvider';
import IProfessionalsRepository from '@modules/professionals/repositories/IProfessionalsRepository';
import IPatientsRepository from '@modules/patients/repositories/IPatientsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import ICreateSessionDTO from '../dtos/ICreateSessionDTO';

interface IRoles {
  professional?: Professional;
  patient?: Patient;
}
interface IResponse extends IRoles {
  accessToken: string;
  refreshToken: string;
}

@injectable()
class CreateSessionService {
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
        throw new AppError('Esta funcionalidade ainda não foi implementada!');

      default:
        break;
    }

    return {
      accessToken,
      refreshToken,
      ...data,
    };
  }
}

export default CreateSessionService;
