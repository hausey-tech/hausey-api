import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';

interface Props {
  dependentId: string;
  holderId: string;
}

@injectable()
export class RemoveDependentService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ dependentId, holderId }: Props): Promise<void> {
    const dependent = await this.dependentsRepository.findById(dependentId);

    if (!dependent) {
      throw new AppError('Dependente não encontrado.');
    }

    if (dependent.holderId !== holderId) {
      throw new AppError(
        'Você não tem permissão para remover este dependente.',
      );
    }

    if (dependent.dependentPatientId) {
      await this.patientsRepository.update(dependent.dependentPatientId, {
        planId: null,
        planExpiresAt: null,
      });
    }

    dependent.status = 'removed';
    await this.dependentsRepository.save(dependent);
    await this.dependentsRepository.softDelete(dependentId);
  }
}
