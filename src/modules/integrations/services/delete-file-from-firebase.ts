import { injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { firebaseBucketInstance } from '../utils/firebase-instance';

interface IProps {
  name: string;
}

@injectable()
export class DeleteFileFromFirebaseService {
  public async execute({ name }: IProps): Promise<void> {
    try {
      const bucketFile = firebaseBucketInstance.file(name);
      await bucketFile.delete();
    } catch (error) {
      console.log(error);
      throw new AppError(
        'Ocorreu um erro ao deletar o(s) arquivo(s), tente novamente!',
      );
    }
  }
}
