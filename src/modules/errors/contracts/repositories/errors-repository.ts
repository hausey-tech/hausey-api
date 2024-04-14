import { Error } from '../../entities/error-entity';
import { ICreateErrorDTO } from '../dtos/create-error-dto';

export interface IErrorsRepository {
  create: (payload: ICreateErrorDTO) => Promise<Error>;
  save: (error: Error) => Promise<Error>;
}
