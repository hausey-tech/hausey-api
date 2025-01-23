import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodeSellersRepository } from '../../seller-code-sellers/contracts/repositories/seller-code-sellers-repository';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
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
  patients: PatientsPaginatedResponse;
  sellerCodes: SellerCode[];
  sellerCodeSellers: SellerCodeDetails[];
}

@injectable()
export class FilterAdminService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

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
    SellerCodeResponse | PatientsPaginatedResponse | Patient | Patient[] | any
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

      const allPatients = await this.patientsRepository.findAll();

      const patientsWhereSellerIdIsNull: Patient[] = allPatients.filter(
        patient => !patient.sellerId,
      );

      const totalPages = Math.ceil(patientsWhereSellerIdIsNull.length / take);

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
              this.logger.warn(
                `Seller not found for sellerCode ID: ${sellerCodeSeller.sellerCodeId}`,
              );
              return null;
            }

            if (!sellerCodeSeller.sellerId) {
              this.logger.warn(
                `Seller not found for SellerCodeSeller ID: ${sellerCodeSeller.sellerId}`,
              );
              return null;
            }

            const [patients, totalPatients] =
              await this.patientsRepository.findBySellerIdPaginated(
                sellerCode.sellerId,
                skip,
                take,
              );

            const totalPagesAllPatients = Math.ceil(totalPatients / take);

            const paginatedPatients: PatientsPaginatedResponse = {
              patients,
              totalPatients,
              totalPages: totalPagesAllPatients,
            };

            const userInfo = await this.usersRepository.findById(
              sellerCode.sellerId,
            );

            const sellerInfo = {
              phoneNumber: userInfo.phoneNumber,
              email: userInfo.email,
              name: userInfo.name,
              createdAt: userInfo.createdAt,
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

      const allSellerCodes = await this.sellerCodesRepository.findAll();

      const allSellerCodesNotInSellerCodesSellers = allSellerCodes.filter(
        sellerCode =>
          !validSellerCodeSellers.some(
            sellerCodeSeller => sellerCodeSeller.sellerCodeId === sellerCode.id,
          ),
      );

      const MapperAllSellerCodesNotInSellerCodesSellers = await Promise.all(
        allSellerCodesNotInSellerCodesSellers.map(async sellerCodesMapper => {
          const userMapper = await this.usersRepository.findById(
            sellerCodesMapper.sellerId,
          );

          return {
            id: sellerCodesMapper.id,
            createdAt: sellerCodesMapper.createdAt,
            name: userMapper?.name || null,
            phoneNumber: userMapper?.phoneNumber || null,
            email: userMapper?.email || null,
            updatedAt: sellerCodesMapper.updatedAt,
            deletedAt: sellerCodesMapper.deletedAt,
            code: sellerCodesMapper.code,
            sellerId: sellerCodesMapper.sellerId,
            uses: sellerCodesMapper.uses,
            active: sellerCodesMapper.active,
            fee: sellerCodesMapper.fee,
            maxUse: sellerCodesMapper.maxUse,
            free: sellerCodesMapper.free,
            type: sellerCodesMapper.type,
          };
        }),
      );

      const validSellerCodes = sellerCodes.filter(Boolean);

      const endIndex = skip + take;

      const patientsPaginated = patientsWhereSellerIdIsNull.slice(
        skip,
        endIndex,
      );

      return {
        patients: {
          patients: patientsPaginated,
          totalPages,
          totalPatients: patientsWhereSellerIdIsNull.length,
        },
        sellerCodeSellers: validSellerCodes,
        sellerCodes: MapperAllSellerCodesNotInSellerCodesSellers,
      };
    }

    const [patients, totalPatients] =
      await this.patientsRepository.findPaginated(skip, take);

    const totalPages = Math.ceil(totalPatients / take);

    return {
      patients,
      totalPatients,
      totalPages,
    };
  }
}
