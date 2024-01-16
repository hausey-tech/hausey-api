import { injectable, inject } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { IHashProvider } from '../../../shared/providers/HashProvider/entities/hash-provider';
import { User } from '../entities/user';
import { IRolesRepository } from '../../roles/contracts/repositories/roles';

interface CreateUser {
  email: string;
  password: string;
  name: string;
  document: string;
  birthdate: string;
  phoneNumber: string;
  sex: 'M' | 'F';
  roleType: string;
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
  ) {}

  public async execute(payload: CreateUser): Promise<User> {
    const { email, document, password, phoneNumber, roleType } = payload;

    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Já existe um usuário com este email, faça o login!');
    }

    const hasUserWithPhoneNumber = await this.usersRepository.findByPhoneNumber(
      phoneNumber,
    );

    if (hasUserWithPhoneNumber?.deletedAt === null) {
      throw new AppError(
        'Já existe um usuário cadastrado com esse celular, faça o login!',
      );
    }

    if (document) {
      const isCpfValid = cpf.isValid(document);

      if (!isCpfValid) {
        throw new AppError('CPF inválido, verifique e tente novamente!');
      }

      const userWithDocumentExists = await this.usersRepository.findByDocument(
        document,
      );

      if (userWithDocumentExists) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }
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
        roleId: role.id,
        password: hashedPassword,
      });
    }

    const user = await this.usersRepository.create({
      ...payload,
      roleId: role.id,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}
