import { inject, injectable } from 'tsyringe';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { IFamilyByPatientDTO } from '../contracts/dtos/family-by-patient-dto';

@injectable()
export class GetFamilyByPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientDependentsRepository')
    private dependentsRepository: IPatientDependentsRepository,
  ) {}

  public async execute(patientId: string): Promise<IFamilyByPatientDTO> {
    const linkAsDependent =
      await this.dependentsRepository.findByDependentPatientId(patientId);

    if (linkAsDependent) {
      const members = await this.dependentsRepository.findByHolderId(
        linkAsDependent.holderId,
      );

      return {
        role: 'dependent',
        holder: linkAsDependent.holder,
        members,
      };
    }

    const holder = await this.patientsRepository.findById(patientId);
    const members = await this.dependentsRepository.findByHolderId(patientId);

    return {
      role: 'holder',
      holder,
      members,
    };
  }
}
