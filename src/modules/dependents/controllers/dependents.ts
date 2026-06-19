import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddDependentService } from '../services/add-dependent';
import { ListDependentsService } from '../services/list-dependents';
import { RemoveDependentService } from '../services/remove-dependent';
import { AcceptInviteService } from '../services/accept-invite';
import { ResendInviteService } from '../services/resend-invite';
import { GetHolderByDependentService } from '../services/get-holder-by-dependent';

export class DependentsController {
  public async add(request: Request, response: Response): Promise<Response> {
    const holderId = request.user.id;
    const { hasAppAccess, email, name, birthdate, cpf } = request.body;

    const addDependentService = container.resolve(AddDependentService);

    const dependent = await addDependentService.execute({
      holderId,
      hasAppAccess,
      ...(hasAppAccess ? { email } : { name, birthdate, cpf }),
    } as Parameters<typeof addDependentService.execute>[0]);

    return response.status(201).json(dependent);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const holderId = request.user.id;

    const listDependentsService = container.resolve(ListDependentsService);

    const dependents = await listDependentsService.execute(holderId);

    return response.json(dependents);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const holderId = request.user.id;
    const { id } = request.params;

    const removeDependentService = container.resolve(RemoveDependentService);

    await removeDependentService.execute({ dependentId: id, holderId });

    return response.status(204).send();
  }

  public async acceptInvite(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { inviteToken, patientId } = request.body;

    const acceptInviteService = container.resolve(AcceptInviteService);

    const dependent = await acceptInviteService.execute({
      inviteToken,
      patientId,
    });

    return response.json(dependent);
  }

  public async resendInvite(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const holderId = request.user.id;
    const { id } = request.params;

    const resendInviteService = container.resolve(ResendInviteService);

    const dependent = await resendInviteService.execute({
      dependentId: id,
      holderId,
    });

    return response.json(dependent);
  }

  public async getHolderByDependent(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { dependentPatientId } = request.params;

    const getHolderByDependentService = container.resolve(
      GetHolderByDependentService,
    );

    const result = await getHolderByDependentService.execute(
      dependentPatientId,
    );

    return response.json(result);
  }
}
