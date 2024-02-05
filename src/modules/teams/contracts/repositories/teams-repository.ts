import { Team } from '../../entities/team-entity';
import { ICreateTeamDTO } from '../dtos/create-team-dto';

export interface ITeamsRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  create(payload: ICreateTeamDTO): Promise<Team>;
  save(team: Team): Promise<Team>;
}
