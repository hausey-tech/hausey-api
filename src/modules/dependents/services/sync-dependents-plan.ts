import { inject, injectable } from 'tsyringe';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { ISyncDependentsPlanDTO } from '../contracts/dtos/sync-dependents-plan-dto';

@injectable()
export class SyncDependentsPlanService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    holderId,
    planId,
    planExpiresAt,
  }: ISyncDependentsPlanDTO): Promise<void> {
    const activeDependents =
      await this.dependentsRepository.findActiveByHolderId(holderId);

    if (activeDependents.length === 0) {
      return;
    }

    const planExpiresAtValue =
      planExpiresAt instanceof Date
        ? planExpiresAt.toISOString()
        : planExpiresAt ?? null;

    await Promise.all(
      activeDependents
        .filter(dep => dep.dependentPatientId !== null)
        .map(dep =>
          this.patientsRepository.update(dep.dependentPatientId, {
            planId: planId ?? null,
            planExpiresAt: planExpiresAtValue,
          }),
        ),
    );
  }
}
