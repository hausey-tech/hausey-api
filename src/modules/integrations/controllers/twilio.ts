import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTwilioRoom } from '../services/create-twilio-room';

export class TwilioController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { identity, room } = request.body;

    const createTwilioRoomService = container.resolve(CreateTwilioRoom);

    const token = await createTwilioRoomService.execute(identity, room);

    return response.json({ token });
  }
}
