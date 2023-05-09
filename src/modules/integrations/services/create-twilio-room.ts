import { injectable } from 'tsyringe';
import { jwt } from 'twilio';

@injectable()
export class CreateTwilioRoom {
  public async execute(identity: string, room: string): Promise<any> {
    const { AccessToken } = jwt;
    const { VideoGrant } = AccessToken;

    let videoGrant: any;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
    );

    if (room !== undefined) {
      videoGrant = new VideoGrant({ room });
    } else {
      videoGrant = new VideoGrant();
    }

    token.identity = identity;
    token.addGrant(videoGrant);

    return token.toJwt();
  }
}
