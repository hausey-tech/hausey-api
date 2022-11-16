import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindSlotsBySpecialtyService, CreateSlotService } from '../services';

export class SlotsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { specialtyId } = request.params;

    const findSlotsBySpecialtyService = container.resolve(
      FindSlotsBySpecialtyService,
    );

    const slots = await findSlotsBySpecialtyService.execute(specialtyId);

    return response.json(slots);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const id = request.user?.id;
    const { professionalId, weekDay, startTime, endTime } = request.body;

    const createSlotService = container.resolve(CreateSlotService);

    const slot = await createSlotService.execute({
      professionalId: professionalId || id,
      weekDay,
      startTime,
      endTime,
    });

    return response.json(slot);
  }
}
