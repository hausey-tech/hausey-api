import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllAppointmentsService } from '../services/find-all-appointments';
import { CheckAppointmentPrice } from '../services/check-appointment-price';
import { CreateAppointmentService } from '../services/create-appointment';
import { UploadFileToS3 } from '../../integrations/services/upload-file-to-s3';
import { ListAppointmentFilesService } from '../services/list-appointment-files';
import { ToggleAppointmentPaidService } from '../services/toggle-appointment-paid';

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
    const { specialtyId, date } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );

    const appointment = await createAppointmentService.execute({
      patientId: id,
      specialtyId,
      date,
    });

    return response.json(appointment);
  }

  public async checkPrice(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;
    const { specialtyId } = request.params;

    const checkAppointmentPriceService = container.resolve(
      CheckAppointmentPrice,
    );

    const prices = await checkAppointmentPriceService.execute(id, specialtyId);

    return response.json(prices);
  }

  public async uploadFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { files } = request;

    const { appointmentId } = request.params;

    const uploadFileService = container.resolve(UploadFileToS3);

    await uploadFileService.execute(
      files as Express.Multer.File[],
      `appointments/${appointmentId}`,
    );

    return response.json({ message: 'Arquivo(s) enviado(s) com sucesso!' });
  }

  public async listFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;

    const listAppointmentFilesService = container.resolve(
      ListAppointmentFilesService,
    );

    const files = await listAppointmentFilesService.execute({
      appointmentId,
      request,
    });

    return response.json(files);
  }

  public async togglePaid(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;

    const toggleAppointmentPaidService = container.resolve(
      ToggleAppointmentPaidService,
    );

    const appointment = await toggleAppointmentPaidService.execute(
      appointmentId,
    );

    return response.json(appointment);
  }
}
