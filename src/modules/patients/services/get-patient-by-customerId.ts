import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class GetPatientByCustomerId {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(params: { patientId?: string }): Promise<Patient> {
    const { patientId } = params;

    const patient = await this.patientsRepository.findByCustomerId(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return patient;
  }
}
