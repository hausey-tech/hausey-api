import { AppError } from 'shared/errors/app-error';
import { injectable, inject } from 'tsyringe';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class GetPatientInfos {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(params: { patientId?: string }): Promise<Patient> {
    const { patientId } = params;

    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return patient;
  }
}
