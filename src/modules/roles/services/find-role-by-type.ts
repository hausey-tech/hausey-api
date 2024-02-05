import { injectable, inject } from 'tsyringe';

import { IRolesRepository } from '../contracts/repositories/roles';
import { Role } from '../entities/role';

type Props = {
  roleType: string;
};
@injectable()
export class FindRolesByType {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute({ roleType }: Props): Promise<Role[]> {
    const roles = await this.rolesRepository.findByType(roleType);

    return roles;
  }
}
