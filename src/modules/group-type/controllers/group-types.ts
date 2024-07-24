import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindGroupTypes } from '../services/find-all-group-types';
import { CreateGroupType } from '../services/create-group-type';
import { UpdateGroupType } from '../services/update-group-type';
import { DeleteGroupType } from '../services/delete-group-type';

export class GroupTypesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { withSpecialty } = request.query;
    const findAllPlansService = container.resolve(FindGroupTypes);

    const plans = await findAllPlansService.execute({
      withSpecialty: withSpecialty === 'true',
    });

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, roleId } = request.body;

    const createPlanService = container.resolve(CreateGroupType);

    const plan = await createPlanService.execute({ name, description, roleId });

    return response.json(plan);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { groupTypeId } = request.params;
    const payload = request.body;

    const updateGroupService = container.resolve(UpdateGroupType);

    const groupType = await updateGroupService.execute({
      groupTypeId,
      payload,
    });

    return response.json(groupType);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { groupTypeId } = request.params;

    const deleteGroupService = container.resolve(DeleteGroupType);

    const groupType = await deleteGroupService.execute({
      groupTypeId,
    });

    return response.json(groupType);
  }
}
