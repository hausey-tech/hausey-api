import { injectable, inject } from 'tsyringe';

import { IGroupTypesRepository } from '../contracts/repositories/group-types';
import { GroupType } from '../entities/group-type';

@injectable()
export class FindGroupTypes {
  constructor(
    @inject('GroupTypesRepository')
    private groupTypesRepository: IGroupTypesRepository,
  ) {}

  public async execute(): Promise<GroupType[]> {
    const roles = await this.groupTypesRepository.findAll();

    return roles;
  }
}
