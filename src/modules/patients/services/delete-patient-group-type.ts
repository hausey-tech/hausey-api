import { injectable, inject } from 'tsyringe';
import { IPatientGroupsRepository } from '../contracts/repositories/patient-groups';
import { IPatientGroupTypesRepository } from '../contracts/repositories/patient-group-types';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class DeletePatientGroupTypeService {
  constructor(
    @inject('PatientGroupsRepository')
    private patientGroupsRepository: IPatientGroupsRepository,

    @inject('PatientsGroupTypesRepository')
    private patientGroupTypesRepository: IPatientGroupTypesRepository,
  ) {}

  public async execute(patientGroupTypeId: string): Promise<void> {
    const patientGroupType = await this.patientGroupTypesRepository.findById(
      patientGroupTypeId,
    );

    if (!patientGroupType) {
      throw new AppError(
        'Grupo não encontrado, verifique o id e tente novamente!',
      );
    }

    const patientGroup = await this.patientGroupsRepository.findById(
      patientGroupType.patientGroupId,
    );

    if (patientGroup && patientGroup.patientGroupTypes.length === 1) {
      await this.patientGroupsRepository.delete(
        patientGroupType.patientGroupId,
      );
      return;
    }

    await this.patientGroupTypesRepository.delete(patientGroupTypeId);
  }
}
