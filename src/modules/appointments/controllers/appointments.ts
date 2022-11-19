import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CheckAppointmentPrice } from '../services/check-appointment-price';

export class AppointmentsController {
  public async read(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;

    return response.json({ appointmentId });
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
