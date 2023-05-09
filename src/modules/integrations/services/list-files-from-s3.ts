import { injectable } from 'tsyringe';
import { Request } from 'express';
import { ListObjectsCommand } from '@aws-sdk/client-s3';

import { AppError } from '../../../shared/errors/app-error';
import { s3Instance } from '../utils/s3-instance';

@injectable()
export class ListFilesFromS3 {
  public async execute(request: Request, prefix?: string): Promise<any> {
    const { protocol } = request;

    const baseUrl = `${protocol}://${request.get('host')}`;

    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    });

    try {
      const response = await s3Instance.send(command);
      if (!response.Contents) return [];
      const files = response.Contents.map(item => {
        const splittedKey = item.Key.split('/');
        const name = splittedKey[splittedKey.length - 1].slice(37);
        return {
          name,
          url: `${baseUrl}/v1/integrations/s3/files/${item.Key}`,
        };
      });
      return files;
    } catch (err) {
      throw new AppError(
        'Ocorreu um erro ao resgatar os arquivos, tente novamente!',
      );
    }
  }
}
