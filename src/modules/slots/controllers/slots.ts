import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindSlotsService } from '../services/find-slots';
import { CreateSlotService } from '../services/create-slot';

export class SlotsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { professionaId, days = 3 } = request.query;

    const findSlotsService = container.resolve(FindSlotsService);

    const slots = await findSlotsService.execute({
      professionaId: professionaId as string,
      days: days as number,
    });

    return response.json(slots);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { professionalId, slots } = request.body;

    const createSlotService = container.resolve(CreateSlotService);

    await createSlotService.execute({
      professionalId,
      slots,
    });

    return response.json({ message: 'Escala cadastrada com sucesso!' });
  }
}
