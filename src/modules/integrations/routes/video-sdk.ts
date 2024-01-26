import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateAuthTokenSchema } from '../celebrate-schemas/video-sdk';
import { VideoSdkController } from '../controllers/videosdk';

export const videoSdkRouter = Router();
const videoSdkController = new VideoSdkController();

videoSdkRouter.post(
  '/video-sdk',
  ensureAuthentication,
  celebrate(CreateAuthTokenSchema),
  videoSdkController.create,
);
