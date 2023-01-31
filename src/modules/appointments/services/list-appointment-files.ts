import { Request } from 'express';
import { injectable, inject, container } from 'tsyringe';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { ListFilesFromS3 } from '../../integrations/services/list-files-from-s3';
import { AppError } from '../../../shared/errors/app-error';

interface IPayload {
  appointmentId: string;
  request: Request;
}

@injectable()
export class ListAppointmentFilesService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ appointmentId, request }: IPayload): Promise<any> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const listFilesService = container.resolve(ListFilesFromS3);

    const files = await listFilesService.execute(
      request,
      `appointments/${appointmentId}`,
    );

    return files;
  }
}
