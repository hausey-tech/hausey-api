import { injectable, inject, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { UploadFilesToFirebaseService } from '../../integrations/services/upload-files-to-firebase';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPatientFilesRepository } from '../contracts/repositories/patient-files';

interface IProps {
  patientId: string;
  title: string;
  file: Express.Multer.File;
}

@injectable()
export class UploadPatientFileService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientFilesRepository')
    private patientFilesRepository: IPatientFilesRepository,
  ) {}

  public async execute({ patientId, title, file }: IProps): Promise<void> {
    const patient = await this.patientsRepository.findById(patientId);

    if (patient === null) {
      throw new AppError(
        'Id de Paciente não encontrado, verifique e tente novamente!',
      );
    }
    console.log('file: ', file);
    const uploadFilesService = container.resolve(UploadFilesToFirebaseService);
    const [fileUrl] = await uploadFilesService.execute({
      files: [file],
      prefix: `patients/${patientId}`,
    });

    const fileRow = await this.patientFilesRepository.create({
      patientId,
      fileUrl,
      title,
    });

    await this.patientFilesRepository.save(fileRow);
  }
}
