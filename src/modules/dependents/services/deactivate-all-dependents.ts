import { inject, injectable } from 'tsyringe';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';

interface Props {
  holderId: string;
}

@injectable()
export class DeactivateAllDependentsService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ holderId }: Props): Promise<void> {
    const activeDependents =
      await this.dependentsRepository.findActiveByHolderId(holderId);

    if (activeDependents.length === 0) {
      return;
    }

    await Promise.all(
      activeDependents.map(async dep => {
        await this.dependentsRepository.save({ ...dep, status: 'removed' });

        if (dep.dependentPatientId) {
          await this.patientsRepository.update(dep.dependentPatientId, {
            planId: null,
            planExpiresAt: null,
            isPro: false,
          });
        }
      }),
    );
  }
}
