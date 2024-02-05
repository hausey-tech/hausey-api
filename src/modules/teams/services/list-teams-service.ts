import { injectable, inject } from 'tsyringe';
import { ITeamsRepository } from '../contracts/repositories/teams-repository';
import { Team } from '../entities/team-entity';

@injectable()
export class ListTeamsService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
  ) {}

  public async execute(): Promise<Team[]> {
    return this.teamsRepository.findAll();
  }
}
