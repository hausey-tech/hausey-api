import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateVideoAuthToken } from '../services/create-video-auth-token';

export class VideoSdkController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { room } = request.body;

    const createVideoSdkService = container.resolve(CreateVideoAuthToken);

    const token = await createVideoSdkService.execute(room);

    return response.json({ token });
  }
}
