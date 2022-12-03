import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CheckAppointmentPrice } from '../services/check-appointment-price';
import { CreateAppointmentService } from '../services/create-appointment';

export class AppointmentsController {
  public async read(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;

    return response.json({ appointmentId });
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
}
