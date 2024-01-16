import { injectable, inject } from 'tsyringe';

import { IRolesRepository } from '../contracts/repositories/roles';
import { Role } from '../entities/role';

@injectable()
export class FindAllRoles {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute(): Promise<Role[]> {
    const roles = await this.rolesRepository.findAll();

    return roles;
  }
}
