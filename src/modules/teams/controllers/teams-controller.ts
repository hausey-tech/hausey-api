import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTeamsService } from '../services/list-teams-service';
import { CreateTeamService } from '../services/create-team-service';

export class TeamsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTeamsService = container.resolve(ListTeamsService);
    const teams = await listTeamsService.execute();
    return response.json(teams);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { body } = request;
    const createTeamService = container.resolve(CreateTeamService);
    const team = await createTeamService.execute(body);
    return response.json(team);
  }
}
