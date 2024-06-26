import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '../services/create-user';
import { UpdateUserService } from '../services/update-user';
import { CreateSessionService } from '../../sessions/services/create-session';
import { ListUsersService } from '../services/list-users';
import { GetUserInfos } from '../services/get-user-infos';
import { CreateBankAccountService } from '../services/create-bank-account-service';
import { UpdateBankAccountService } from '../services/update-bank-account-service';

export class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const listPatientsService = container.resolve(ListUsersService);

    const patients = await listPatientsService.execute(query);

    return response.json(patients);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createUserService = container.resolve(CreateUserService);

    await createUserService.execute(payload);

    const createSessionService = container.resolve(CreateSessionService);

    const { email, password } = payload;

    const session = await createSessionService.execute({
      email,
      password,
      role: 'manager',
    });

    return response.json(session);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { userId } = request.params;
    const payload = request.body;

    const updatePatientService = container.resolve(UpdateUserService);

    const patient = await updatePatientService.execute(userId, payload);

    return response.json(patient);
  }

  public async getInfos(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId } = request.params;

    const getPatientInfosService = container.resolve(GetUserInfos);

    const patient = await getPatientInfosService.execute({ userId });

    return response.json(patient);
  }

  public async createBankAccount(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, bankAccount } = request.body;
    const createBankAccountService = container.resolve(
      CreateBankAccountService,
    );
    await createBankAccountService.execute({ id, bankAccount });
    return response.json({ message: 'Conta bancária vinculada com sucesso!' });
  }

  public async updateBankAccount(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, bankAccount } = request.body;
    const updateBankAccountService = container.resolve(
      UpdateBankAccountService,
    );
    await updateBankAccountService.execute({ id, bankAccount });
    return response.json({ message: 'Conta bancária atualizada com sucesso!' });
  }
}
