import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../services/CreateUserService';
import FindByIdService from '../services/FindByIdService';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({ message: 'testando lista' });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute(payload);

    return response.json(user);
  }

  public async read(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findByIdService = container.resolve(FindByIdService);

    const user = await findByIdService.execute(id);

    return response.json(user);
  }
}

export default UsersController;
