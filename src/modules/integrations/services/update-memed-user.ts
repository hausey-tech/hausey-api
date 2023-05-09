import { injectable } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { memedInstance } from '../utils/memed-instance';

interface Props {
  id: string;
  payload: any;
}

@injectable()
export class UpdateMemedUser {
  public async execute({ id, payload }: Props): Promise<any> {
    try {
      const { data } = await memedInstance.patch(
        `/sinapse-prescricao/usuarios/${id}`,
        {
          data: {
            type: 'usuarios',
            attributes: {
              ...payload,
            },
          },
        },
      );
      return {
        userToken: data?.data?.attributes?.token,
        user: data?.data?.attributes,
      };
    } catch (err) {
      const error =
        err?.response?.data?.errors.length > 0
          ? err?.response?.data?.errors[0]?.detail
          : err.message;
      const statusCode = err?.response?.status;
      throw new AppError(error, statusCode);
    }
  }
}
