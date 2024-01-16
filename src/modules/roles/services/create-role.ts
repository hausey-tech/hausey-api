import { injectable, inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { IRolesRepository } from '../contracts/repositories/roles';
import { Role } from '../entities/role';

interface Props {
  name: string;
  title: string;
  type: string;
}

@injectable()
export class CreateRole {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  public async execute({ name, title, type }: Props): Promise<Role> {
    const planExists = await this.rolesRepository.findByName(name);

    if (planExists) {
      throw new AppError('Já existe um plano com esse nome!');
    }

    const role = await this.rolesRepository.create({
      name,
      title,
      type,
    });

    return this.rolesRepository.save(role);
  }
}
