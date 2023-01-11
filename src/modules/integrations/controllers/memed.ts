import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '../../../shared/errors/app-error';
import { GetMemedUserByToken } from '../services/get-memed-user-by-token';
import { CreateMemedUser } from '../services/create-memed-user';
import { SearchMemedUser } from '../services/search-memed-user';
import { ImportMemedSpecialties } from '../services/import-memed-specialties';

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

  public async getUserByToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { token } = request.params;

    const getMemedUserByTokenService = container.resolve(GetMemedUserByToken);

    try {
      const user = await getMemedUserByTokenService.execute(token);
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

  public async importSpecialties(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const importMemedSpecialtiesService = container.resolve(
      ImportMemedSpecialties,
    );

    try {
      const specialties = await importMemedSpecialtiesService.execute();
      return response.json(specialties);
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
