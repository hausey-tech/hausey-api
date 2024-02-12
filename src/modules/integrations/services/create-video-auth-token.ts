import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

@injectable()
export class CreateVideoAuthToken {
  public async execute(room: string): Promise<any> {
    const options: jwt.SignOptions = {
      expiresIn: '120m',
      algorithm: 'HS256',
    };
    const payload = {
      apikey: process.env.VIDEO_SDK_API_KEY,
      permissions: [`allow_join`, 'allow_mod'], // `ask_join` || `allow_mod`
      version: 2, // OPTIONAL
      roomId: room,
    };
    const secret = process.env.VIDEO_SDK_SECRET_KEY || '';

    const token = jwt.sign(payload, secret, options);

    return token;
  }
}
