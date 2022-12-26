import fs from 'fs';
import { injectable } from 'tsyringe';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { AppError } from '../../../shared/errors/app-error';
import { s3Instance } from '../utils/s3-instance';

@injectable()
export class UploadFileToS3 {
  public async execute(
    file: Express.Multer.File,
    prefix?: string,
  ): Promise<void> {
    const fileStream = fs.createReadStream(file.path);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: `${prefix ? `${prefix}/` : ''}${file.filename}`,
    });

    try {
      await s3Instance.send(command);
    } catch (err) {
      throw new AppError(
        'Ocorreu um erro ao subir o arquivo, tente novamente!',
      );
    }
  }
}
