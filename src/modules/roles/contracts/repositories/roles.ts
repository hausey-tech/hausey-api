import { Role } from '../../entities/role';
import { ICreateRoleDTO } from '../dtos/create-role-dto';

export interface IRolesRepository {
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
  findByType(type: string): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  create(role: ICreateRoleDTO): Promise<Role>;
  save(role: Role): Promise<Role>;
}
