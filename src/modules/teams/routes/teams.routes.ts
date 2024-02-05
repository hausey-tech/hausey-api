import { Router } from 'express';
import { celebrate } from 'celebrate';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { TeamsController } from '../controllers/teams-controller';
import { CreateTeamSchema } from '../contracts/schemas/create-team-schema';

export const teamsRouter = Router();
const teamsController = new TeamsController();

teamsRouter.get('/', ensureAuthentication, teamsController.index);
teamsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateTeamSchema),
  teamsController.create,
);
