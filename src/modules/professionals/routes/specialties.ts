import { Router } from 'express';
import { SpecialtiesController } from '../controllers';

export const specialtiesRouter = Router();
const specialtiesController = new SpecialtiesController();

specialtiesRouter.get('/specialties', specialtiesController.index);
