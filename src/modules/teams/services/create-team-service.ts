import { injectable, inject } from 'tsyringe';
import { ITeamsRepository } from '../contracts/repositories/teams-repository';
import { Team } from '../entities/team-entity';
import { ICreateTeamDTO } from '../contracts/dtos/create-team-dto';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
  ) {}

  public async execute(payload: ICreateTeamDTO): Promise<Team> {
    const team = await this.teamsRepository.findByName(payload.name);

    if (team) {
      throw new AppError(
        'Já existe uma equipe com este nome, verifique e tente novamente!',
      );
    }

    return this.teamsRepository.create(payload);
  }
}
