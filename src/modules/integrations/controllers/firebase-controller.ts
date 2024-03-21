import { type Request, type Response } from 'express';
import { container } from 'tsyringe';
import { DeleteFileFromFirebaseService } from '../services/delete-file-from-firebase';

export class FirebaseController {
  public async deleteFile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { url } = request.body;
    const splittedUrl = url.split('/');
    const name = splittedUrl[splittedUrl.length - 1].replaceAll('%2F', '/');
    const deleteFileService = container.resolve(DeleteFileFromFirebaseService);
    await deleteFileService.execute({ name });
    return response.json({ message: 'Arquivo deletado com sucesso!' });
  }
}
