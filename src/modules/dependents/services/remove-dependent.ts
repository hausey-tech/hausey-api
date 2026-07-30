import { inject, injectable, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { UpdatePatientIsProService } from '../../patients/services/update-patient-is-pro';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';

interface Props {
  dependentId: string;
  requesterPatientId: string;
}

@injectable()
export class RemoveDependentService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    dependentId,
    requesterPatientId,
  }: Props): Promise<void> {
    const dependent = await this.dependentsRepository.findById(dependentId);

    if (!dependent) {
      throw new AppError('Dependente não encontrado.');
    }

    const isHolder = dependent.holderId === requesterPatientId;
    const isSelf = dependent.dependentPatientId === requesterPatientId;

    if (!isHolder && !isSelf) {
      throw new AppError(
        'Você não tem permissão para remover este dependente.',
      );
    }

    if (dependent.dependentPatientId) {
      const patient = await this.patientsRepository.findById(
        dependent.dependentPatientId,
      );

      if (patient?.planExpiresAt) {
        const expiredPatient = await this.patientsRepository.update(
          dependent.dependentPatientId,
          { planExpiresAt: new Date(0).toISOString() },
        );

        const updatePatientIsProService = container.resolve(
          UpdatePatientIsProService,
        );
        await updatePatientIsProService.execute(expiredPatient);
      }

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
