import { injectable, inject } from 'tsyringe';
import { type IErrorsRepository } from '../contracts/repositories/errors-repository';
import { ICreateErrorDTO } from '../contracts/dtos/create-error-dto';

@injectable()
export class CreateErrorService {
  constructor(
    @inject('ErrorsRepository')
    private readonly errorsRepository: IErrorsRepository,
  ) {}

  public async execute({
    userId,
    statusCode,
    message,
  }: ICreateErrorDTO): Promise<void> {
    await this.errorsRepository.create({ userId, statusCode, message });
  }
}
