import { injectable } from 'tsyringe';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { AppError } from '../../../shared/errors/app-error';
import { s3Instance } from '../utils/s3-instance';

@injectable()
export class GetFileFromS3 {
  public async execute(key: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    try {
      const response = await s3Instance.send(command);
      return response.Body;
    } catch (err) {
      throw new AppError(
        'Ocorreu um erro ao resgatar o arquivo, tente novamente!',
      );
    }
  }
}
