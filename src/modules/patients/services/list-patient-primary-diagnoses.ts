import { injectable, inject } from 'tsyringe';

import { IPatientPrimaryDiagnosesRepository } from '../contracts/repositories/patient-primary-diagnoses';
import { PatientPrimaryDiagnosis } from '../entities/patient-primary-diagnosis';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { AppError } from '../../../shared/errors/app-error';
import { Patient } from '../entities/patient';

@injectable()
export class ListPatientPrimaryDiagnosesService {
  constructor(
    @inject('PatientPrimaryDiagnosesRepository')
    private patientPrimaryDiagnosesRepository: IPatientPrimaryDiagnosesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(payload: {
    id: string;
    type: 'patient' | 'user';
  }): Promise<PatientPrimaryDiagnosis[]> {
    const { id, type } = payload;
    let patient: Patient;

    if (type === 'patient') {
      patient = await this.patientsRepository.findById(id);
    } else {
      patient = await this.patientsRepository.findByUserId(id);
    }

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return this.patientPrimaryDiagnosesRepository.findByPatientId(patient.id);
  }
}
