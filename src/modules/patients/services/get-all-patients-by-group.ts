import { injectable, inject } from 'tsyringe';

import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPatientGroupsRepository } from '../contracts/repositories/patient-groups';
import { IPatientGroupTypesRepository } from '../contracts/repositories/patient-group-types';
import { Patient } from '../entities/patient';

interface Props {
  groupTypes: string[];
}

@injectable()
export class GetAllPatientsByGroupService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientGroupsRepository')
    private patientGroupsRepository: IPatientGroupsRepository,

    @inject('PatientsGroupTypesRepository')
    private patientGroupTypesRepository: IPatientGroupTypesRepository,
  ) {}

  public async execute({ groupTypes }: Props): Promise<Patient[]> {
    const patientGroupsTypes =
      await this.patientGroupTypesRepository.findByGroupTypeIds(groupTypes);

    if (patientGroupsTypes.length > 0) {
      const patientGroupsIds = patientGroupsTypes.map(
        group => group.patientGroupId,
      );

      const groups = await this.patientGroupsRepository.findByIds(
        patientGroupsIds,
      );

      const patientIds = groups.map(group => group.patientId);

      const patients = await this.patientsRepository.findAllByIds(patientIds);

      return patients;
    }
    return [];
  }
}
