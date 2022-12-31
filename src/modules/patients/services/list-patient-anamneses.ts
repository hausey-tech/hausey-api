import { injectable, inject } from 'tsyringe';

import { IPatientAnamnesesRepository } from '../contracts/repositories/patient-anamneses';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { PatientAnamnesis } from '../entities/patient-anamnesis';
import { AppError } from '../../../shared/errors/app-error';
import { Patient } from '../entities/patient';

@injectable()
export class ListPatientAnamnesesService {
  constructor(
    @inject('PatientAnamnesesRepository')
    private patientAnamnesesRepository: IPatientAnamnesesRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(payload: {
    id: string;
    type: 'patient' | 'user';
  }): Promise<PatientAnamnesis[]> {
    const { id, type } = payload;
    let checkPatientExists: Patient;

    if (type === 'patient') {
      checkPatientExists = await this.patientsRepository.findById(id);
    } else {
      checkPatientExists = await this.patientsRepository.findByUserId(id);
    }

    if (!checkPatientExists) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return this.patientAnamnesesRepository.findByPatientId(
      checkPatientExists.id,
    );
  }
}
