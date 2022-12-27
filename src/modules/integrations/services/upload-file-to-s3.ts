import { v4 as uuid } from 'uuid';
import { injectable } from 'tsyringe';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { AppError } from '../../../shared/errors/app-error';
import { s3Instance } from '../utils/s3-instance';

@injectable()
export class UploadFileToS3 {
  public async execute(
    files: Express.Multer.File[],
    prefix?: string,
  ): Promise<void> {
    const commands = files.map(file => {
      const formattedPrefix = prefix ? `${prefix}/` : '';
      const formattedName = file.originalname
        .replace(/\s/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: `${formattedPrefix}${uuid()}-${formattedName}`,
      });
    });

    try {
      await Promise.all(
        commands.map(async command => {
          await s3Instance.send(command);
        }),
      );
    } catch (err) {
      throw new AppError(
        'Ocorreu um erro ao subir o(s) arquivo(s), tente novamente!',
      );
    }
  }
}
