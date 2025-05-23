import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodeSellersRepository } from '../../seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { SellerCode } from '../../seller-codes/entities/seller-code';

interface PatientsPaginatedResponse {
  patients: Array<Patient>;
  totalPatients: number;
  totalPages: number;
}

interface SellerCodeDetails {
  phoneNumber: string;
  email: string;
  name: string;
  patients: PatientsPaginatedResponse;
  sellerCode: SellerCode;
}

interface SellerCodeResponse {
  sellerCodesSellers: SellerCodeDetails[];
  patients: PatientsPaginatedResponse;
}

@injectable()
export class ListPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(query: {
    professionalId?: string;
    userId?: string;
    type?: string;
    page?: string;
    perPage?: string;
    name?: string;
    cpf?: string;
  }): Promise<
    SellerCodeResponse | PatientsPaginatedResponse | Patient | Patient[] | any
  > {
    const {
      professionalId,
      userId,
      type,
      page = 1,
      perPage = 10,
      name,
      cpf,
    } = query;

    if (name) {
      return this.patientsRepository.findByName(name);
    }

    if (cpf) {
      const cpfLimpo = cpf.replace(/\D/g, '');
      return this.patientsRepository.findByDocument(cpfLimpo);
    }

    if (Number.isNaN(page) || Number(page) < 1) {
      throw new AppError('Page must be a valid number');
    }

    if (Number.isNaN(perPage) || Number(perPage) < 1) {
      throw new AppError('Invalid limit value');
    }

    // const skip = (Number(page) - 1) * Number(perPage);
    // const take = Number(perPage);

    if (professionalId) {
      const appointments = await this.appointmentsRepository.findByProfessional(
        professionalId,
      );

      const patientIds = appointments.map(appointment => appointment.patientId);

      const patients = await this.patientsRepository.findAllByIds(patientIds);

      return patients;
    }

    if (userId) {
      const sellerCodeSellers =
        await this.sellerCodeSellersRepository.findBySellerId(userId);

      const patients = await this.patientsRepository.findBySellerId(userId);

      const sellerCodes = await Promise.all(
        sellerCodeSellers.map(async sellerCodeSeller => {
          try {
            const sellerCode = await this.sellerCodesRepository.findByIdAndType(
              sellerCodeSeller.sellerCodeId,
              type,
            );

            if (!sellerCode) {
              return null;
            }

            const allPatients = await this.patientsRepository.findBySellerId(
              sellerCode.sellerId,
            );

            const sellerInfo = {
              phoneNumber: sellerCodeSeller.seller?.phoneNumber,
              email: sellerCodeSeller.seller?.email,
              name: sellerCodeSeller.seller?.name,
              createdAt: sellerCodeSeller.seller?.createdAt,
              patients: allPatients,
              sellerCode,
            };

            return sellerInfo;
          } catch (error) {
            this.logger.error(
              {
                error: error.message,
                stack: error.stack,
              },
              `Error processing sellerCodeSeller ${sellerCodeSeller.sellerCodeId}:`,
            );

            return null;
          }
        }),
      );

      const validSellerCodes = sellerCodes.filter(Boolean);

      return {
        patients,
        sellerCodesSellers: validSellerCodes,
      };
    }

    const patients = await this.patientsRepository.find();

    return patients;
  }
}
