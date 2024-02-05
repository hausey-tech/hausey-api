import { TeamProfessional } from '../../entities/team-professional-entity';
import { ICreateTeamProfessionalDTO } from '../dtos/create-team-professional-dto';

export interface ITeamProfessionalsRepository {
  findByTeamId(teamId: string): Promise<TeamProfessional[]>;
  create(payload: ICreateTeamProfessionalDTO): Promise<TeamProfessional>;
  save(teamProfessional: TeamProfessional): Promise<TeamProfessional>;
}
