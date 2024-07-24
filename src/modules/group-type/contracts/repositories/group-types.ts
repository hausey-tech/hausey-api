import { FindOptionsWhere } from 'typeorm';
import { GroupType } from '../../entities/group-type';
import { ICreateGroupTypeDto } from '../dtos/create-group-type';

export interface IGroupTypesRepository {
  findAll(options?: FindOptionsWhere<GroupType>): Promise<GroupType[]>;
  findByName(name: string): Promise<GroupType | null>;
  findById(id: string): Promise<GroupType | null>;
  findByRoleId(roleId: string): Promise<GroupType[] | null>;
  create(payload: ICreateGroupTypeDto): Promise<GroupType>;
  update(groupId: string, payload: ICreateGroupTypeDto): Promise<GroupType>;
  save(patient: GroupType): Promise<GroupType>;
  delete(groupId: string): Promise<GroupType>;
}
