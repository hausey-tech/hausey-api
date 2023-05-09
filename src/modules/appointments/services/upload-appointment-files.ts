import { injectable, inject, container } from 'tsyringe';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { UploadFilesToS3 } from '../../integrations/services/upload-files-to-s3';
import { AppError } from '../../../shared/errors/app-error';

interface IPayload {
  appointmentId: string;
  files: Express.Multer.File[];
}

@injectable()
export class UploadAppointmentFilesService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ appointmentId, files }: IPayload): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const uploadFilesService = container.resolve(UploadFilesToS3);

    await uploadFilesService.execute(files, `appointments/${appointmentId}`);
  }
}
