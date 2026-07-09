import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { authConfig } from '../../../config/auth';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';

interface Props {
  dependentId: string;
  holderId: string;
}

interface Response {
  accessToken: string;
  refreshToken: string;
  dependentPatientId: string;
  name: string | null;
}

@injectable()
export class GenerateDependentAccessTokenService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute({ dependentId, holderId }: Props): Promise<Response> {
    const dependent = await this.dependentsRepository.findById(dependentId);

    if (!dependent) {
      throw new AppError('Dependente não encontrado.');
    }

    if (dependent.holderId !== holderId) {
      throw new AppError('Você não tem permissão para este dependente.');
    }

    if (dependent.hasAppAccess) {
      throw new AppError(
        'Geração de acesso disponível apenas para dependentes sem acesso ao app.',
      );
    }

    if (dependent.status !== 'active' || !dependent.dependentPatientId) {
      throw new AppError('Este dependente não possui um vínculo ativo.');
    }

    const { secret, expiresIn, refreshExpiresIn } = authConfig.jwt;

    const accessToken = sign(
      { id: dependent.dependentPatientId, role: 'patient' },
      secret,
      { expiresIn },
    );

    const refreshToken = sign(
      { id: dependent.dependentPatientId, role: 'patient' },
      secret,
      { expiresIn: refreshExpiresIn },
    );

    return {
      accessToken,
      refreshToken,
      dependentPatientId: dependent.dependentPatientId,
      name: dependent.name,
    };
  }
}
