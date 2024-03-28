import { injectable, inject } from 'tsyringe';

import { IPatientGroupsRepository } from '../contracts/repositories/patient-groups';

import { PatientGroup } from '../entities/patient-group';

interface Props {
  patientId: string;
}
@injectable()
export class GetGroupsByPatientService {
  constructor(
    @inject('PatientGroupsRepository')
    private patientGroupsRepository: IPatientGroupsRepository,
  ) {}

  public async execute(payload: Props): Promise<PatientGroup[]> {
    const { patientId } = payload;
    const patientGroupsTypes =
      await this.patientGroupsRepository.findByPatientId(patientId);

    if (!patientGroupsTypes) {
      return null;
    }
    return patientGroupsTypes;
  }
}
