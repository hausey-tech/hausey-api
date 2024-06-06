import { injectable, inject, container } from 'tsyringe';
import { DeleteFileFromFirebaseService } from '../../integrations/services/delete-file-from-firebase';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPatientFilesRepository } from '../contracts/repositories/patient-files';

interface IProps {
  id: string;
}

@injectable()
export class DeletePatientFileService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PatientFilesRepository')
    private patientFilesRepository: IPatientFilesRepository,
  ) {}

  public async execute({ id }: IProps): Promise<string> {
    const file = await this.patientFilesRepository.findById(id);

    if (file === null) {
      throw new AppError(
        'Id de Arquivo não encontrado, verifique e tente novamente!',
      );
    }

    const deleteFileFromFirebaseService = container.resolve(
      DeleteFileFromFirebaseService,
    );
    const fileName =
      file.fileUrl.split('%2F')[file.fileUrl.split('%2F').length - 1];
    await deleteFileFromFirebaseService.execute({
      // name: `${file.fileUrl.split('/')[-1]}`,
      name: `patients/${file.patientId}/${fileName}`,
    });

    await this.patientFilesRepository.hardDeleteById(id);
    return 'Arquivo apagado com sucesso!';
  }
}
