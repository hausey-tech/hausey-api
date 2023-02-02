import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadAppointmentFilesService } from '../services/upload-appointment-files';
import { ToggleAppointmentPaidService } from '../services/toggle-appointment-paid';
import { ListAppointmentFilesService } from '../services/list-appointment-files';
import { UpdateAppointmentService } from '../services/update-appointment';
import { CreateAppointmentService } from '../services/create-appointment';
import { FindAppointmentsService } from '../services/find-appointments';
import { SetProfessionalService } from '../services/set-professional';
import { CheckAppointmentPrice } from '../services/check-appointment-price';
import { CreatePrescriptionService } from '../services/create-prescription';
import { DeletePrescriptionService } from '../services/delete-prescription';

export class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const findAppointmentsService = container.resolve(FindAppointmentsService);

    const appointments = await findAppointmentsService.execute(query);

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

  public async update(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;
    const payload = request.body;

    const updateAppointmentService = container.resolve(
      UpdateAppointmentService,
    );

    const appointment = await updateAppointmentService.execute({
      appointmentId,
      payload,
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

    const prices = await checkAppointmentPriceService.execute(
      id,
      specialtyId as string,
    );

    return response.json(prices);
  }

  public async uploadFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { files } = request;

    const { appointmentId } = request.params;

    const uploadAppointmentFilesService = container.resolve(
      UploadAppointmentFilesService,
    );

    await uploadAppointmentFilesService.execute({
      appointmentId,
      files: files as Express.Multer.File[],
    });

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

  public async setProfessional(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId, professionalId } = request.params;

    const setProfessionalService = container.resolve(SetProfessionalService);

    const appointment = await setProfessionalService.execute({
      appointmentId,
      professionalId,
    });

    return response.json(appointment);
  }

  public async createPrescription(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;
    const { prescriptionId } = request.body;

    const createPrescriptionService = container.resolve(
      CreatePrescriptionService,
    );

    const appointment = await createPrescriptionService.execute({
      appointmentId,
      prescriptionId,
    });

    return response.json(appointment);
  }

  public async deletePrescription(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId, prescriptionId } = request.params;

    const deletePrescriptionService = container.resolve(
      DeletePrescriptionService,
    );

    const appointment = await deletePrescriptionService.execute({
      appointmentId,
      prescriptionId,
    });

    return response.json(appointment);
  }
}
