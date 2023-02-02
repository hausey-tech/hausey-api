import { AppError } from 'shared/errors/app-error';
import { injectable } from 'tsyringe';

import { memedInstance } from '../utils/memed-instance';

@injectable()
export class GetMemedPrescriptionPdfUrl {
  public async execute({
    externalId,
    token,
  }: {
    externalId: string;
    token: string;
  }): Promise<string> {
    const { data } = await memedInstance.get(
      `/prescricoes/${externalId}/url-document/full?token=${token}`,
    );
    if (data.data[0]) {
      return data.data[0].attributes?.link;
    }
    throw new AppError('Erro ao recuperar link do PDF da prescrição!');
  }
}
