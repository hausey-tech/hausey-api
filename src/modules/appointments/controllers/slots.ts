import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAvailableSlotsService } from '../services/find-available-slots';
import { CreateSlotService } from '../services/create-slot';

export class SlotsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { specialtyId } = request.params;
    const { days = 3 } = request.query;

    const findAvailableSlotsService = container.resolve(
      FindAvailableSlotsService,
    );

    const availableSlots = await findAvailableSlotsService.execute({
      specialtyId,
      days: days as number,
    });

    return response.json(availableSlots);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const roleId = request.user?.roleId;
    const { professionalId, weekDay, startTime, endTime } = request.body;

    const createSlotService = container.resolve(CreateSlotService);

    const slot = await createSlotService.execute({
      professionalId: professionalId || roleId,
      weekDay,
      startTime,
      endTime,
    });

    return response.json(slot);
  }
}
