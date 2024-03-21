import { celebrate } from 'celebrate';
import { Router, type RequestHandler } from 'express';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { DeleteFileFromFirebaseSchema } from '../celebrate-schemas/delete-file-from-firebase-schema';
import { FirebaseController } from '../controllers/firebase-controller';

export const firebaseRoutes = Router();
const firebaseController = new FirebaseController();

firebaseRoutes.delete(
  '/firebase/files',
  ensureAuthentication,
  celebrate(DeleteFileFromFirebaseSchema),
  firebaseController.deleteFile as RequestHandler,
);
