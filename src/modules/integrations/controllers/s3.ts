import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetFileFromS3 } from '../services/get-file-from-s3';

export class S3Controller {
  public async read(request: Request, response: Response): Promise<Response> {
    const { key } = request.params;

    const getFileService = container.resolve(GetFileFromS3);

    const readStream = await getFileService.execute(key);

    return readStream.pipe(response);
  }
}
