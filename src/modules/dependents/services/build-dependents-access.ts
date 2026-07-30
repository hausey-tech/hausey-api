import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { authConfig } from '../../../config/auth';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IDependentAccess } from '../contracts/dtos/dependent-access-dto';

@injectable()
export class BuildDependentsAccessService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(holderPatientId: string): Promise<IDependentAccess[]> {
    const noAppDependents =
      await this.dependentsRepository.findActiveByHolderId(holderPatientId);

    const filtered = noAppDependents.filter(
      dep => !dep.hasAppAccess && dep.dependentPatientId,
    );

    if (filtered.length === 0) {
      return [];
    }

    const { secret, expiresIn, refreshExpiresIn } = authConfig.jwt;

    return filtered.map(dep => ({
      dependentPatientId: dep.dependentPatientId,
      name: dep.name,
      accessToken: sign(
        { id: dep.dependentPatientId, role: 'patient' },
        secret,
        { expiresIn },
      ),
      refreshToken: sign(
        { id: dep.dependentPatientId, role: 'patient' },
        secret,
        { expiresIn: refreshExpiresIn },
      ),
    }));
  }
}
