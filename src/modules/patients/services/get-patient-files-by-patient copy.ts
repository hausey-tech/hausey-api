import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPatientFilesRepository } from '../contracts/repositories/patient-files';
import { PatientFiles } from '../entities/patient-files';

interface Props {
  patientId: string;
}
@injectable()
export class GetPatientFilesByPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientFilesRepository')
    private patientFilesRepository: IPatientFilesRepository,
  ) {}

  public async execute(payload: Props): Promise<PatientFiles[]> {
    const { patientId } = payload;
    const patient = await this.patientsRepository.findById(patientId);
    if (patient === null) {
      throw new AppError(
        'Id de Paciente não encontrado, verifique e tente novamente!',
      );
    }
    const patientFiles = await this.patientFilesRepository.findByPatientId(
      patientId,
    );
    return patientFiles;
  }
}
