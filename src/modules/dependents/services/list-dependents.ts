import { inject, injectable } from 'tsyringe';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { PatientDependent } from '../entities/patient-dependent';

@injectable()
export class ListDependentsService {
  constructor(
    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(holderId: string): Promise<PatientDependent[]> {
    return this.dependentsRepository.findByHolderId(holderId);
  }
}
