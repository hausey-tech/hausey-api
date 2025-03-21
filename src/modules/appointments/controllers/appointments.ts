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
import { ToggleFinishedService } from '../services/toggle-finished';
import { Appointment } from '../entities/appointment';
import { ToggleCanceledService } from '../services/toggle-canceled';

const clients = new Map<string, Response>();

export class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const findAppointmentsService = container.resolve(FindAppointmentsService);

    const appointments = await findAppointmentsService.execute(query);

    return response.json(appointments);
  }

  public async events(request: Request, response: Response): Promise<Response> {
    const userId = request.query.userId as string;
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Allow-Origin', '*'); // Pode ser necessário se o seu frontend estiver em um domínio diferente

    if (clients.has(userId)) {
      return response.status(400).json({ message: 'User already connected' });
    }

    if (!userId) {
      return response.status(400).end();
    }

    clients.set(userId, response);

    response.write('event: connected\n');
    response.write(`data: {"message": "SSE connection established"}\n\n`);

    request.on('close', () => {
      clients.delete(userId);
    });

    return response.status(200).json({ message: 'SSE connection established' });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { professionalId, date, patientId, emergency } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService,
    );
    let appointment: Appointment;
    if (professionalId && !emergency) {
      const appointmentProfessional = await createAppointmentService.execute({
        patientId,
        professionalId,
        date,
        emergency,
      });
      appointment = appointmentProfessional;
    }

    if (emergency) {
      const appointmentEmergency = await createAppointmentService.execute({
        patientId,
        emergency,
        date,
      });
      appointment = appointmentEmergency;
    }

    clients.forEach((client, userId) => {
      try {
        client.write(`event: new-appointment\n`);
        client.write(`data: ${JSON.stringify(appointment)}\n\n`);
      } catch (error) {
        // Se ocorrer erro ao escrever, significa que a conexão foi fechada
        clients.delete(userId); // Remove o cliente do Map
      }
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

    clients.forEach(client => {
      client.write(`event: updated-appointment\n`);
      client.write(`data: ${JSON.stringify(appointment)}\n\n`);
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

  public async toggleFinished(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;

    const toggleFinishedService = container.resolve(ToggleFinishedService);

    const appointment = await toggleFinishedService.execute({
      appointmentId,
    });

    return response.json(appointment);
  }

  public async toggleCanceled(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { appointmentId } = request.params;

    const toggleCanceledService = container.resolve(ToggleCanceledService);

    const appointment = await toggleCanceledService.execute({
      appointmentId,
    });

    return response.json(appointment);
  }
}
