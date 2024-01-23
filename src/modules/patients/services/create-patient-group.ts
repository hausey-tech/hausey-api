import { injectable, inject } from 'tsyringe';

import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPatientGroupsRepository } from '../contracts/repositories/patient-groups';
import { IPatientGroupTypesRepository } from '../contracts/repositories/patient-group-types';
import { PatientGroup } from '../entities/patient-group';
import { AppError } from '../../../shared/errors/app-error';

interface Props {
  observations: string;
  patientId: string;
  roleId: string;
  groupTypes: string[];
}
@injectable()
export class CreatePatientGroupService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientGroupsRepository')
    private patientGroupsRepository: IPatientGroupsRepository,

    @inject('PatientsGroupTypesRepository')
    private patientGroupTypesRepository: IPatientGroupTypesRepository,
  ) {}

  public async execute(payload: Props): Promise<PatientGroup> {
    const { observations, patientId, roleId, groupTypes } = payload;
    const patientExists = await this.patientsRepository.findById(patientId);

    if (!patientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique o id e tente novamente!',
      );
    }
    const patientGroup = await this.patientGroupsRepository.create({
      observations,
      patientId,
      roleId,
    });

    const patientGroupSave = await this.patientGroupsRepository.save(
      patientGroup,
    );

    groupTypes.map(async groupTypeId => {
      const patientGroupTypes = await this.patientGroupTypesRepository.create({
        patientGroupId: patientGroupSave.id,
        groupTypeId,
      });
      this.patientGroupTypesRepository.save(patientGroupTypes);
    });

    return this.patientGroupsRepository.save(patientGroup);
  }
}
