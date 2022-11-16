import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '../services/create-user';
import { FindUserByIdService } from '../services/find-user-by-id';
import { UpdateUserService } from '../services/update-user';
import { DeleteUserService } from '../services/delete-user';

export class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute(payload);

    delete user.password;

    return response.json(user);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const findUserByIdService = container.resolve(FindUserByIdService);

    const user = await findUserByIdService.execute(id);

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const payload = request.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute(id, payload);

    return response.json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute(id);

    return response.json({ message: 'Usuário deletado com sucesso!' });
  }
}
