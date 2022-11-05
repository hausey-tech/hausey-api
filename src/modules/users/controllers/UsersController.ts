import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../services/CreateUserService';
import FindByIdService from '../services/FindByIdService';
import UpdateUserService from '../services/UpdateUserService';
import DeleteUserService from '../services/DeleteUserService';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({ message: 'Lista todos usuários!' });
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

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const payload = request.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute(id, payload);

    return response.json(user);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute(id);

    return response.json({ message: 'Usuário deletado com sucesso!' });
  }
}

export default UsersController;
