import { Router } from 'express';
import { SpecialtiesController } from '../../professionals/controllers';
import { AppointmentsController } from '../controllers';

export const appointmentsRouter = Router();
const specialtiesController = new SpecialtiesController();
const appointmentsController = new AppointmentsController();

appointmentsRouter.get('/specialties', specialtiesController.index);
appointmentsRouter.get('/slots/:specialtyId', appointmentsController.read);
