import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ITeamProfessionalsRepository } from '../contracts/repositories/team-professionals-repository';
import { TeamProfessional } from '../entities/team-professional-entity';
import { ICreateTeamProfessionalDTO } from '../contracts/dtos/create-team-professional-dto';

export class TeamProfessionalsRepository
  implements ITeamProfessionalsRepository
{
  private ormRepository: Repository<TeamProfessional>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(TeamProfessional);
    this.relations = ['team', 'professional'];
  }

  public async findByTeamId(teamId: string): Promise<TeamProfessional[]> {
    return this.ormRepository.find({
      where: { teamId },
      relations: this.relations,
    });
  }

  public async create(
    payload: ICreateTeamProfessionalDTO,
  ): Promise<TeamProfessional> {
    const teamProfessional = this.ormRepository.create(payload);
    return this.ormRepository.save(teamProfessional);
  }

  public async save(
    professionalTeam: TeamProfessional,
  ): Promise<TeamProfessional> {
    return this.ormRepository.save(professionalTeam);
  }
}
