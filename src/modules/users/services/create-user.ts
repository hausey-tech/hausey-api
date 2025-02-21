import { injectable, inject, container } from 'tsyringe';

import { Logger } from 'pino';
import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { User } from '../entities/user';
import { IRolesRepository } from '../../roles/contracts/repositories/roles';
import { ISellerCodesRepository } from '../../seller-codes/contracts/repositories/seller-codes';
import { generateRandomCode } from '../utils/create-random-code';
import { CreateSellerCode } from '../../seller-codes/services/create-seller-code';
import { mailer } from '../../../shared/utils/mailer';
import { WelcomeRepresentantHtmlText } from '../../../shared/utils/html-texts';

interface CreateUser {
  email: string;
  password: string;
  name: string;
  document: string;
  birthdate: string;
  phoneNumber: string;
  sex: 'M' | 'F';
  roleType: string;
  sellerCode?: {
    fee?: number;
    free?: boolean;
    maxUse?: number;
    type?: string;
    discounts?: {
      planId: string;
      discount: number;
    }[];
    sellers?: {
      sellerId: string;
      fee: number;
    }[];
  };
  region?: string;
}
@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,

    @inject('SellerCodesRepository')
    private sellerCodesRepository: ISellerCodesRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(payload: CreateUser): Promise<User> {
    try {
      const { email, password, roleType, sellerCode, region } = payload;

      const userExists = await this.usersRepository.findByEmail(email);

      if (userExists) {
        throw new AppError(
          'Já existe um usuário com este email, faça o login!',
        );
      }

      let hashedPassword: string;

      if (password) {
        hashedPassword = await this.hashProvider.generateHash(password);
      }

      const patientDeleted = await this.usersRepository.findByEmailWithDeleted(
        email,
      );
      const role = await this.rolesRepository.findByType(roleType);

      if (!role) {
        throw new AppError('RoleType Inválido, verifique e tente novamente!');
      }

      if (patientDeleted) {
        return this.usersRepository.restore(patientDeleted.id, {
          ...payload,
          roleId: role[0].id,
          password: hashedPassword,
        });
      }

      const user = await this.usersRepository.create({
        ...payload,
        roleId: role[0].id,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);

      if (roleType === 'comercial') {
        let isUnique = false;
        let code;
        /* eslint-disable no-await-in-loop */
        while (!isUnique) {
          code = generateRandomCode(savedUser.name);
          const codeExists = await this.sellerCodesRepository.findByCode(code);

          if (!codeExists) {
            isUnique = true;
            const { fee, free, maxUse, discounts, sellers, type } = sellerCode;
            const createSellerCode = container.resolve(CreateSellerCode);
            await createSellerCode.execute({
              sellerId: savedUser.id,
              code,
              fee,
              free,
              maxUse,
              type,
              discounts,
              sellers,
              region,
              name: savedUser.name,
            });
            mailer({
              to: savedUser.email,
              subject: `💙Boas Vindas à Hausey!`,
              body: WelcomeRepresentantHtmlText(savedUser.email, password),
            });
          }
        }
      }

      return savedUser;
    } catch (error) {
      this.logger.info(
        {
          error,
        },
        'Houve um erro ao criar operação',
      );

      throw new AppError('Houve um erro ao criar usuário');
    }
  }
}
