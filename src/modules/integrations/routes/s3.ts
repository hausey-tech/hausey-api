import { Router } from 'express';

// import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { S3Controller } from '../controllers/s3';

export const s3Router = Router();
const s3Controller = new S3Controller();

s3Router.get('/s3/files/:key(*)', s3Controller.read);
