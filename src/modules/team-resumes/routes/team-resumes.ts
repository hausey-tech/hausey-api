import { celebrate } from 'celebrate';
import { RequestHandler, Router } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

import { TeamResumeController } from '../controllers/team-resumes';
import {
  CreateTeamResumeSchema,
  FindTeamResumesSchema,
} from '../contracts/schemas/team-resume-schemas';
import { upload } from '../../../shared/utils/multer-instance';

export const teamResumeRouter = Router();
const teamResumeController = new TeamResumeController();

teamResumeRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindTeamResumesSchema),
  teamResumeController.index,
);
teamResumeRouter.post(
  '/',
  celebrate(CreateTeamResumeSchema),
  teamResumeController.create,
);
teamResumeRouter.post(
  '/:teamResumeId/file',
  ensureAuthentication,
  upload.single('file'),
  teamResumeController.uploadFile as RequestHandler,
);
