import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientService } from '../services/create-patient';
import { UpdatePatientService } from '../services/update-patient';
import { CreateSessionService } from '../../sessions/services/create-session';
import { ListPatientsService } from '../services/list-patients';
import { GetPatientInfos } from '../services/get-patient-infos';
import { CreatePatientGroupService } from '../services/create-patient-group';
import { CreatePatientProfessionalAssistanceService } from '../services/create-patient-professional-assistance';

export class PatientsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const listPatientsService = container.resolve(ListPatientsService);

    const patients = await listPatientsService.execute(query);

    return response.json(patients);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPatientService = container.resolve(CreatePatientService);

    await createPatientService.execute(payload);

    const createSessionService = container.resolve(CreateSessionService);

    const { email, password } = payload;

    const session = await createSessionService.execute({
      email,
      password,
      role: 'patient',
    });

    return response.json(session);
  }

  public async createPatientGroup(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const createPatientGroupService = container.resolve(
      CreatePatientGroupService,
    );

    const patientGroup = await createPatientGroupService.execute(payload);

    return response.json(patientGroup);
  }

  public async createPatientProfessionalAssistance(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const createProfessionalAssistanceService = container.resolve(
      CreatePatientProfessionalAssistanceService,
    );

    const patientProfAssistance =
      await createProfessionalAssistanceService.execute(payload);

    return response.json(patientProfAssistance);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.params;
    const payload = request.body;

    const updatePatientService = container.resolve(UpdatePatientService);

    const patient = await updatePatientService.execute(patientId, payload);

    return response.json(patient);
  }

  public async getInfos(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.params;

    const getPatientInfosService = container.resolve(GetPatientInfos);

    const patient = await getPatientInfosService.execute({ patientId });

    return response.json(patient);
  }
}
