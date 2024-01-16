import { injectable, inject } from 'tsyringe';
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../shared/errors/app-error';
import { IUsersRepository } from '../contracts/repositories/users';
import { IUpdateUserDTO } from '../contracts/dtos/update-user';
import { User } from '../entities/user';

@injectable()
export class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, payload: IUpdateUserDTO): Promise<User> {
    const { document } = payload;

    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError(
        'Usuário não encontrado, verifique o id e tente novamente!',
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

    return this.usersRepository.update(id, payload);
  }
}
