import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodeSellersRepository } from '../../seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { IUsersRepository } from '../../users/contracts/repositories/users';

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
  sellerCodes: SellerCodeDetails[];
  patients: PatientsPaginatedResponse;
}

@injectable()
export class FilterAdminService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SellerCodeSellersRepository')
    private sellerCodeSellersRepository: ISellerCodeSellersRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(query: {
    userId?: string;
    type?: string;
    page?: string;
    limit?: string;
  }): Promise<
    SellerCodeResponse | PatientsPaginatedResponse | Patient | Patient[]
  > {
    const { userId, type, page = 1, limit = 10 } = query;

    if (Number.isNaN(page) || Number(page) < 1) {
      throw new AppError('Page must be a valid number');
    }

    if (Number.isNaN(limit) || Number(limit) < 1) {
      throw new AppError('Invalid limit value');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    if (userId) {
      const user = await this.usersRepository.findById(userId);

      if (user.role.name !== 'Administrador') {
        throw new AppError('Você não tem permissão suficiente', 401);
      }
      const sellerCodeSellers =
        await this.sellerCodeSellersRepository.findAll();

      const validSellerCodeSellers = sellerCodeSellers.filter(
        sellerCodeSeller =>
          sellerCodeSeller.sellerCodeId && sellerCodeSeller.sellerId,
      );

      const [patients, totalPatients] =
        await this.patientsRepository.findBySellerId(userId, skip, take);

      const totalPages = Math.ceil(totalPatients / take);

      const sellerCodes = await Promise.all(
        validSellerCodeSellers.map(async sellerCodeSeller => {
          try {
            const sellerCode =
              type !== undefined
                ? await this.sellerCodesRepository.findByIdAndType(
                    sellerCodeSeller.sellerCodeId,
                    type,
                  )
                : await this.sellerCodesRepository.findById(
                    sellerCodeSeller.sellerCodeId,
                  );

            if (!sellerCode) {
              return null;
            }

            if (!sellerCodeSeller.sellerId) {
              this.logger.warn(
                `Seller not found for SellerCodeSeller ID: ${sellerCodeSeller.sellerId}`,
              );
              return null;
            }

            const [allPatients, totalPagePatients] =
              await this.patientsRepository.findBySellerId(
                sellerCode.sellerId,
                skip,
                take,
              );

            const totalPagesAllPatients = Math.ceil(totalPatients / take);

            const paginatedPatients: PatientsPaginatedResponse = {
              patients: allPatients,
              totalPatients: totalPagePatients,
              totalPages: totalPagesAllPatients,
            };

            const sellerInfo = {
              phoneNumber: sellerCodeSeller.seller?.phoneNumber,
              email: sellerCodeSeller.seller?.email,
              name: sellerCodeSeller.seller?.name,
              createdAt: sellerCodeSeller.seller?.createdAt,
              patients: paginatedPatients,
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
        patients: {
          patients,
          totalPages,
          totalPatients,
        },
        sellerCodes: validSellerCodes,
      };
    }

    const [patients, totalPatients] = await this.patientsRepository.find(
      skip,
      take,
    );

    const totalPages = Math.ceil(totalPatients / take);

    return {
      patients,
      totalPatients,
      totalPages,
    };
  }
}
