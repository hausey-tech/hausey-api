import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSessionService } from '../services';

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createSessionService = container.resolve(CreateSessionService);

    const session = await createSessionService.execute(payload);

    return response.json(session);
  }
}
