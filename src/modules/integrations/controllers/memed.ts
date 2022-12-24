import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { CreateMemedUser } from '../services/create-memed-user';
import { SearchMemedUser } from '../services/search-memed-user';

export class MemedController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createMemedUserService = container.resolve(CreateMemedUser);

    try {
      const user = await createMemedUserService.execute(payload);
      return response.json(user);
    } catch (err) {
      const error =
        err?.response?.data?.errors.length > 0
          ? err?.response?.data?.errors[0]?.detail
          : err.message;
      const statusCode = err?.response?.status;

      throw new AppError(error, statusCode);
    }
  }

  public async search(request: Request, response: Response): Promise<Response> {
    const { token } = request.params;

    const searchMemedUserService = container.resolve(SearchMemedUser);

    try {
      const user = await searchMemedUserService.execute(token);
      return response.json(user);
    } catch (err) {
      const error =
        err?.response?.data?.errors.length > 0
          ? err?.response?.data?.errors[0]?.detail
          : err.message;
      const statusCode = err?.response?.status;

      throw new AppError(error, statusCode);
    }
  }
}
