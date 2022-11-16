import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindSlotsBySpecialty } from '../services';

export class AppointmentsController {
  public async read(request: Request, response: Response): Promise<Response> {
    const { specialtyId } = request.params;

    const findSlotsBySpecialtyService = container.resolve(FindSlotsBySpecialty);

    const slots = await findSlotsBySpecialtyService.execute(specialtyId);

    return response.json(slots);
  }
}
