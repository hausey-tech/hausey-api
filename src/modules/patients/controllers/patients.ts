import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from 'shared/errors/app-error';
import { CreatePagarmeCustomerService } from '../../integrations/services/pagarme/create-pagarme-customer-service';
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
import { GetCustomerInfos } from '../services/get-customer-infos';
import { UpdatePatientStriperIdService } from '../services/update-patient-striperid-service';
import { FilterAdminService } from '../services/filter-admin';
import { UploadPatientCsv } from '../services/upload-csv';

const clients = new Map<string, Response>();

export class PatientsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request;

    const listPatientsService = container.resolve(ListPatientsService);

    const patients = await listPatientsService.execute(query);

    return response.json(patients);
  }

  public async filterAdmin(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { query } = request;
    const userAuthenticated = request.user.id;

    const listPatientsService = container.resolve(FilterAdminService);

    const patients = await listPatientsService.execute(
      query,
      userAuthenticated,
    );

    return response.json(patients);
  }

  public async findBySellerId(req: Request, res: Response): Promise<Response> {
    const { sellerId, page, limit } = req.params;

    try {
      const getPatientSellerId = container.resolve(GetPatientSellerId);

      const patientsSeller = await getPatientSellerId.findBySellerId(
        sellerId,
        page,
        limit,
      );
      return res.json(patientsSeller);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body;

    const createPatientService = container.resolve(CreatePatientService);

    console.log('Antes de bater no execute create patient');
    const patient = await createPatientService.execute(payload);

    const createSessionService = container.resolve(CreateSessionService);

    console.log('Após bater no execute create patient');
    const { email, password } = payload;

    console.log('Antes de bater no execute create session');
    const session = await createSessionService.execute({
      email,
      password,
      role: 'patient',
    });

    if (payload.indicatedUserInformations) {
      const pagarmeService = container.resolve(CreatePagarmeCustomerService);

      const pagarmePayload = {
        id: patient.id,
        email: patient.email,
        name: patient.name,
        document: patient.document,
        phoneNumber: patient.phoneNumber,
      };

      const pagarmeId = await pagarmeService.execute(pagarmePayload);

      const updatePatientStriperId = container.resolve(
        UpdatePatientStriperIdService,
      );

      await updatePatientStriperId.execute({
        id: patient.id,
        customerId: pagarmeId,
      });

      const updatePatientPlanPartnerService = container.resolve(
        UpdatePatientPlanPartnerService,
      );

      await updatePatientPlanPartnerService.execute({
        patientId: patient.id,
        priceId: payload.indicatedUserInformations.priceId,
        periodEnd: payload.indicatedUserInformations.periodEnd,
      });

      return response.json(session);
    }
    console.log('Após de bater no execute create session');

    return response.json(session);
  }

  public async uploadCsv(
    request: Request,
    response: Response,
  ): Promise<Response> {
    console.log('Olá, chamei a rota');
    const { file } = request;
    const { sellerId } = request.params;

    if (!sellerId) {
      throw new AppError('SellerId informado inválido');
    }

    if (!file) {
      return response.status(400).json({
        message:
          'Nenhum arquivo CSV foi encontrado. Faça o upload do arquivo ou coloque o nome do parâmetro como "file".',
      });
    }

    const uploadPatients = container.resolve(UploadPatientCsv);

    const message = await uploadPatients.execute(file, sellerId);
    return response.status(201).json({ message });
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
    const { groupTypes } = request.body;
    const { query } = request;

    const getPatientByGroupService = container.resolve(
      GetPatientsByGroupService,
    );

    const patients = await getPatientByGroupService.execute({
      groupTypes,
      query,
    });

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

  public async getPatientPlanInfo(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.params;

    const getCustomerInfos = container.resolve(GetCustomerInfos);

    const patientPlanInfo = getCustomerInfos.execute(patientId);

    return response.json(patientPlanInfo);
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
    const {
      patientId,
      planId,
      paymentMethod,
      months,
      cardToken,
      address,
      amount,
    } = request.body;
    if (paymentMethod === 'pix') {
      const createPatientPixSubscriptionService = container.resolve(
        CreatePatientPixSubscriptionService,
      );
      let handleAmount: number;
      if (amount) {
        handleAmount = amount * 100;
        handleAmount.toFixed(2);
      }
      const pix = await createPatientPixSubscriptionService.execute({
        patientId,
        planId,
        months,
        handleAmount: amount,
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

  public async removePlanId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { patientId } = request.params;
    try {
      const updatePatientService = container.resolve(UpdatePatientService);

      const updatedPatient = await updatePatientService.removePlanId(patientId);
      return response.json({
        message: 'Campo planId removido com sucesso!',
        planId: updatedPatient.planId,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: 'Erro ao remover o planId. Tente novamente mais tarde.',
      });
    }
  }

  public async events(request: Request, response: Response): Promise<void> {
    const patientId = request.query.user as string;
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Allow-Origin', '*');

    clients.set(patientId, response);

    response.write('event: connected\n');
    response.write(`data: {"message": "SSE connection established"}\n\n`);

    request.on('close', () => {
      clients.delete(patientId);
    });
  }

  public async updateSellerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { sellerCode } = request.body;
    const updatePatientService = container.resolve(UpdatePatientService);
    try {
      const updatedPatient = await updatePatientService.updateSellerId(
        id,
        sellerCode,
      );
      return response.status(200).json({
        sellerId: updatedPatient.sellerId,
        message: 'sellerId atualizado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
