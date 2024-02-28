import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSessionService } from '../services/create-session';
import { RefreshSessionService } from '../services/refresh-session-service';

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createSessionService = container.resolve(CreateSessionService);

    const session = await createSessionService.execute(payload);

    return response.json(session);
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, role } = request.user;
    const refreshSessionService = container.resolve(RefreshSessionService);
    const session = await refreshSessionService.execute({ id, role });
    return response.json(session);
  }
}
