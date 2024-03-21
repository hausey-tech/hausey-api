import { randomUUID } from 'crypto';
import { injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { firebaseBucketInstance } from '../utils/firebase-instance';

interface IProps {
  files: Express.Multer.File[];
  prefix: string;
}

@injectable()
export class UploadFilesToFirebaseService {
  public async execute({ files, prefix }: IProps): Promise<string[]> {
    const urls: string[] = [];
    await Promise.all(
      files.map(async file => {
        try {
          const filename = `${randomUUID()}-${file.originalname.split('.')[0]}`;
          const bucketFile = firebaseBucketInstance.file(
            `${prefix}/${filename}`,
          );
          await bucketFile.save(file.buffer, {
            metadata: {
              contentType: file.mimetype,
            },
          });
          await bucketFile.makePublic();
          urls.push(bucketFile.publicUrl());
        } catch (error) {
          console.log(error);
          throw new AppError(
            'Ocorreu um erro ao subir o(s) arquivo(s), tente novamente!',
          );
        }
      }),
    );
    return urls;
  }
}
