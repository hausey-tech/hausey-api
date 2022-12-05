import { injectable, inject } from 'tsyringe';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

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
    const { cpf } = payload;
    const checkUserExists = await this.usersRepository.findById(id);

    if (cpf) {
      const isCpfValid = cpfValidator.isValid(cpf);

      if (!isCpfValid) {
        throw new AppError('CPF inválido, verifique e tente novamente!');
      }

      const checkUserCpfExists = await this.usersRepository.findByCpf(cpf);

      if (checkUserCpfExists) {
        throw new AppError(
          'Já existe um usuário com este CPF, verifique e tente novamente!',
        );
      }
    }

    if (!checkUserExists) {
      throw new AppError(
        'Usuário não encontrado, verifique o id e tente novamente!',
      );
    }

    return this.usersRepository.update(id, payload);
  }
}
