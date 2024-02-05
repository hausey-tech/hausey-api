import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateRoleDTO } from '../contracts/dtos/create-role-dto';
import { Role } from '../entities/role';
import { IRolesRepository } from '../contracts/repositories/roles';

export class RolesRepository implements IRolesRepository {
  private ormRepository: Repository<Role>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Role);
  }

  public async findAll(): Promise<Role[]> {
    return this.ormRepository.find();
  }

  public async findByName(name: string): Promise<Role | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<Role | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByType(type: string): Promise<Role[]> {
    return this.ormRepository.find({ where: { type } });
  }

  public async create(role: ICreateRoleDTO): Promise<Role> {
    return this.ormRepository.create(role);
  }

  public async save(role: Role): Promise<Role> {
    return this.ormRepository.save(role);
  }
}
