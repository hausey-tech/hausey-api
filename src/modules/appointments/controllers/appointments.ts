import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllAppointmentsService } from '../services/find-all-appointments';
import { CheckAppointmentPrice } from '../services/check-appointment-price';
import { CreateAppointmentService } from '../services/create-appointment';
import { UploadFileToS3 } from '../../integrations/services/upload-file-to-s3';
import { ListFilesFromS3 } from '../../integrations/services/list-files-from-s3';

export class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { withoutProfessional } = request.query;

    const findAllAppointmentsService = container.resolve(
      FindAllAppointmentsService,
    );

    const appointments = await findAllAppointmentsService.execute(
      withoutProfessional?.toString(),
    );

    return response.json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { professionalTypeId, professionalSpecialtyId, date } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    const appointment = await createAppointmentService.execute({
      patientId: id,
      professionalTypeId,
      professionalSpecialtyId,
      date,
    });

    return response.json(appointment);
  }

  public async checkPrice(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;
    const { professionalTypeId, professionalSpecialtyId } = request.params;

    const checkAppointmentPriceService = container.resolve(
      CheckAppointmentPrice,
    );

    const prices = await checkAppointmentPriceService.execute(
      id,
      professionalTypeId,
      professionalSpecialtyId,
    );

    return response.json(prices);
  }

  public async uploadFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { file } = request;
    const { appointmentId } = request.params;

    const uploadFileService = container.resolve(UploadFileToS3);

    await uploadFileService.execute(file, `appointments/${appointmentId}`);

    return response.json({ message: 'Arquivo(s) enviado(s) com sucesso!' });
  }

  public async listFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;

    const listFilesService = container.resolve(ListFilesFromS3);

    const files = await listFilesService.execute(
      request,
      `appointments/${appointmentId}`,
    );

    return response.json(files);
  }
}
