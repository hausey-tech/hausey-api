import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreatePatientService } from '../services/create-patient';
import { UpdatePatientService } from '../services/update-patient';
import { CreateSessionService } from '../../sessions/services/create-session';
import { ListPatientsService } from '../services/list-patients';
import { GetPatientInfos } from '../services/get-patient-infos';
import { CreatePatientGroupService } from '../services/create-patient-group';
import { CreatePatientProfessionalAssistanceService } from '../services/create-patient-professional-assistance';
import { GetPatientsByGroupService } from '../services/get-patients-by-group';
import { CreateForwardRequest } from '../services/create-forward-request';
import { ForgotPasswordService } from '../services/forgot-password-service';
import { ResetPasswordService } from '../services/reset-password-service';
import { VerifyTokenService } from '../services/verify-token-service';
import { GetGroupsByPatientService } from '../services/get-groups-by-patient';
import { UpdatePatientPlanPartnerService } from '../services/update-patient-plan-integration';
import { CreatePatientCardSubscriptionService } from '../services/create-patient-card-subscription-service';
import { CreatePatientPixSubscriptionService } from '../services/create-patient-pix-subscription-service';
import { UploadPatientFileService } from '../services/upload-patient-file';
import { GetPatientFilesByPatientService } from '../services/get-patient-files-by-patient copy';
import { DeletePatientFileService } from '../services/delete-patient-file';
import { DeletePatientGroupTypeService } from '../services/delete-patient-group-type';
import { GetPatientSellerId } from '../services/get-patient-sellerid';

export class PatientsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const listPatientsService = container.resolve(ListPatientsService);

    const patients = await listPatientsService.execute(query);

    return response.json(patients);
  }

  public async findBySellerId(req: Request, res: Response): Promise<Response> {
    const { sellerId } = req.params;

    try {
      // Usando tsyringe para injeção de dependência
      const getPatientSellerId = container.resolve(GetPatientSellerId);

      const patientsSeller = await getPatientSellerId.findBySellerId(sellerId);
      return res.json(patientsSeller);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
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

  public async getPatientFiles(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.params;

    const getPatientFilesByPatientService = container.resolve(
      GetPatientFilesByPatientService,
    );

    const patients = await getPatientFilesByPatientService.execute({
      patientId,
    });

    return response.json(patients);
  }

  public async createPatientFile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { file, body } = request;
    const { patientId } = request.params;

    const createPatientFileService = container.resolve(
      UploadPatientFileService,
    );

    const patientFile = await createPatientFileService.execute({
      patientId,
      file,
      ...body,
    });

    return response.json(patientFile);
  }

  public async deletePatientFile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deletePatientFileService = container.resolve(
      DeletePatientFileService,
    );

    const message = await deletePatientFileService.execute({
      id,
    });

    return response.json(message);
  }

  public async getPatientsByGroup(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const getPatientByGroupService = container.resolve(
      GetPatientsByGroupService,
    );

    const patients = await getPatientByGroupService.execute(payload);

    return response.json(patients);
  }

  public async getGroupsByPatient(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.query;

    const getGroupByPatientService = container.resolve(
      GetGroupsByPatientService,
    );

    const groups = await getGroupByPatientService.execute({
      patientId: patientId as string,
    });

    return response.json(groups);
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

  public async deletePatientGroupType(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientGroupTypeId } = request.params;

    const deletePatientGroupTypeService = container.resolve(
      DeletePatientGroupTypeService,
    );

    await deletePatientGroupTypeService.execute(patientGroupTypeId);

    return response.json({ message: 'Paciente desvinculado com sucesso!' });
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
    const { disableCustomerCreation } = request.query;
    const payload = request.body;

    const updatePatientService = container.resolve(UpdatePatientService);

    const patient = await updatePatientService.execute(
      patientId,
      payload,
      disableCustomerCreation as string,
    );

    return response.json(patient);
  }

  public async updatePlan(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.params;
    const payload = request.body;

    const updatePatientPlanPartnerService = container.resolve(
      UpdatePatientPlanPartnerService,
    );

    const patient = await updatePatientPlanPartnerService.execute({
      patientId,
      priceId: payload.priceId,
      periodEnd: payload.periodEnd,
    });

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

  public async createForwardRequest(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body;

    const createForwardRequestService = container.resolve(CreateForwardRequest);

    const message = await createForwardRequestService.execute(payload);

    return response.json(message);
  }

  public async forgotPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email } = request.body;
    const forgotPasswordService = container.resolve(ForgotPasswordService);
    await forgotPasswordService.execute({ email });
    return response.json({
      message: 'O token de verificação foi enviado ao seu email!',
    });
  }

  public async verifyToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, token } = request.body;
    const verifyTokenService = container.resolve(VerifyTokenService);
    await verifyTokenService.execute({
      email,
      token,
    });
    return response.json({ message: 'Token válido!' });
  }

  public async resetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, token, password } = request.body;
    const verifyTokenService = container.resolve(VerifyTokenService);
    await verifyTokenService.execute({
      email,
      token,
    });
    const resetPasswordService = container.resolve(ResetPasswordService);
    await resetPasswordService.execute({
      email,
      password,
    });
    return response.json({ message: 'Senha redefinida com sucesso!' });
  }

  public async createSubscription(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId, planId, paymentMethod, months, cardToken, address } =
      request.body;
    if (paymentMethod === 'pix') {
      const createPatientPixSubscriptionService = container.resolve(
        CreatePatientPixSubscriptionService,
      );
      const pix = await createPatientPixSubscriptionService.execute({
        patientId,
        planId,
        months,
      });
      return response.json(pix);
    }
    const createPatientCardSubscriptionService = container.resolve(
      CreatePatientCardSubscriptionService,
    );
    await createPatientCardSubscriptionService.execute({
      patientId,
      planId,
      paymentMethod,
      cardToken,
      address,
    });
    return response.json({ message: 'Assinatura efetuada com sucesso!' });
  }
}
