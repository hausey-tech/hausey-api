import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';
import { SellerCode } from '../../seller-codes/entities/seller-code';
import { IUsersRepository } from '../../users/contracts/repositories/users';

interface IResponse {
  sellerCodeMapper: {
    name: string;
    phoneNumber: string;
    email: string;
    sellerCode: SellerCode;
  };
  patients: Patient[];
}

@injectable()
export class FilterAdminService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(
    query: {
      userId?: string;
      type?: string;
      page?: string;
      limit?: string;
    },
    userAuthenticated: string,
  ): Promise<IResponse | any> {
    try {
      const { userId, page = 1, limit = 10, type } = query;

      if (Number.isNaN(page) || Number(page) < 1) {
        throw new AppError('Page must be a valid number');
      }

      if (Number.isNaN(limit) || Number(limit) < 1) {
        throw new AppError('Invalid limit value');
      }

      // const skip = (Number(page) - 1) * Number(limit);
      // const take = Number(limit);

      if (userId) {
        const user = await this.usersRepository.findById(userAuthenticated);

        if (!user) {
          throw new AppError('Usuário não encontrado.', 404);
        }

        if (user.role.name !== 'Administrador') {
          throw new AppError('Você não tem permissão suficiente', 401);
        }

        let sellerCodes;

        if (type) {
          sellerCodes = await this.sellerCodesRepository.findByType(type);
        } else {
          sellerCodes = await this.sellerCodesRepository.findAll();
        }

        const sellerCodeMapper = await Promise.all(
          sellerCodes.map(async sellerCode => {
            const patients = await this.patientsRepository.findAllBySellerId(
              sellerCode.sellerId,
            );

            const userBySellerId = await this.usersRepository.findById(
              sellerCode.sellerId,
            );

            if (!userBySellerId) {
              return {
                sellerCode: {
                  id: null,
                  region: null,
                  name: null,
                  phoneNumber: null,
                  email: null,
                  ...sellerCode,
                },
                patients,
              };
            }

            return {
              sellerCode: {
                id: userBySellerId?.id || null,
                name: userBySellerId?.name || null,
                phoneNumber: userBySellerId?.phoneNumber || null,
                email: userBySellerId?.email || null,
                region: userBySellerId?.region || null,
                ...sellerCode,
              },
              patients,
            };
          }),
        );

        return sellerCodeMapper;
      }

      throw new AppError('UserId inválido.');
    } catch (error) {
      this.logger.error(error.message, error);
      throw error;
    }
  }
}
