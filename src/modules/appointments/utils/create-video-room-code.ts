import jwt from 'jsonwebtoken';
import { videoSdkInstance } from '../../integrations/utils/video-sdk-instance';
import { AppError } from '../../../shared/errors/app-error';

interface RoomResponse {
  roomId: string;
  customRoomId: string;
  userId: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  links: {
    get_room: string;
    get_session: string;
  };
}
export const createVideoRoomCode = async () => {
  const options: jwt.SignOptions = {
    expiresIn: '120m',
    algorithm: 'HS256',
  };
  const payload = {
    apikey: process.env.VIDEO_SDK_API_KEY,
    permissions: [`allow_join`], // `ask_join` || `allow_mod`
    version: 2, // OPTIONAL
  };
  const secret = process.env.VIDEO_SDK_SECRET_KEY || '';

  const token = jwt.sign(payload, secret, options);
  console.log('token', token);
  try {
    const { data } = await videoSdkInstance.post(
      '/rooms',
      {},
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    );
    return data as RoomResponse;
  } catch (err) {
    throw new AppError(
      'Erro ao criar sala de atendimento, entre em contato com o suporte!',
      500,
    );
  }
};
