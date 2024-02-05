import { injectable, inject } from 'tsyringe';
import { ITeamsRepository } from '../contracts/repositories/teams-repository';
import { AppError } from '../../../shared/errors/app-error';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { ICreateTeamProfessionalDTO } from '../contracts/dtos/create-team-professional-dto';
import { ITeamProfessionalsRepository } from '../contracts/repositories/team-professionals-repository';
import { TeamProfessional } from '../entities/team-professional-entity';

@injectable()
export class AddProfessionalToTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('TeamProfessionalsRepository')
    private teamProfessionalsRepository: ITeamProfessionalsRepository,
  ) {}

  public async execute({
    teamId,
    professionalId,
    responsible,
  }: ICreateTeamProfessionalDTO): Promise<TeamProfessional> {
    const professional = await this.professionalsRepository.findById(
      professionalId,
    );
    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    const team = await this.teamsRepository.findById(teamId);
    if (!team) {
      throw new AppError('Equipe não encontrada, verifique e tente novamente!');
    }

    return this.teamProfessionalsRepository.create({
      teamId,
      professionalId,
      responsible,
    });
  }
}
