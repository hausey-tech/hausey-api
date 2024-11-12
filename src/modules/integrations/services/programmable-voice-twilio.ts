import twilio from 'twilio';

export class CreateCallService {
  private readonly accountSid: string;

  private readonly authToken: string;

  private readonly twilioNumber: string;

  private readonly client: any;

  constructor() {
    this.accountSid = process.env.TWILIO_ACOUNT_SID_DEV;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioNumber = process.env.TWILIO_NUMBER_DEV;
    this.client = twilio(this.accountSid, this.authToken);
  }

  public async createCall(): Promise<string> {
    const call = await this.client.calls.create({
      to: '+5585999246230',
      from: this.twilioNumber,
      twiml:
        '<Response><Say voice="alice" language="pt-BR" rate="0.9">Há um paciente aguardando atendimento na emergência</Say></Response>',
    });
    return call.sid;
  }
}
