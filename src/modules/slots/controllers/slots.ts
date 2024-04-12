import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindSlotsService } from '../services/find-slots';
import { CreateSlotService } from '../services/create-slot';
import { DeleteSlotService } from '../services/delete-slot';

export class SlotsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { professionalId } = request.query;

    const findSlotsService = container.resolve(FindSlotsService);

    const slots = await findSlotsService.execute({
      professionalId: professionalId as string,
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

  public async delete(request: Request, response: Response): Promise<Response> {
    const { slotId } = request.params;

    const deleteSlotService = container.resolve(DeleteSlotService);

    const slot = await deleteSlotService.execute({
      id: slotId,
    });

    return response.json(slot);
  }
}
