import twilio from 'twilio';
import { Logger } from 'pino';
import { inject } from 'tsyringe';
import { Professional } from '../../professionals/entities/professional';

interface CreateCallResponse {
  sid: string;
  status: any;
}

interface IAvailability {
  id: string;
  professional: Professional;
  date: Date;
  profissionalType: string;
  slots: {
    startTime: string;
    endTime: string;
  };
}

export class CreateCallService {
  private readonly accountSid: string;

  private readonly authToken: string;

  private readonly twilioNumber: string;

  private readonly client: any;

  constructor(
    @inject('Logger')
    private logger: Logger,
  ) {
    this.accountSid = process.env.TWILIO_ACOUNT_SID_DEV;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioNumber = process.env.TWILIO_NUMBER_DEV;
    this.client = twilio(this.accountSid, this.authToken);
  }

  public async createCall({
    iAvailability,
    to,
  }: {
    iAvailability?: IAvailability;
    to?: string;
  }): Promise<CreateCallResponse> {
    const call = await this.client.calls.create({
      to: iAvailability?.professional?.phoneNumber ?? to,
      from: this.twilioNumber,
      method: 'POST',
      statusCallback:
        'https://hausey-staging-api-1a8e126728a0.herokuapp.com/v1/alert-professional/webhook/call-status',
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['completed'],
      twiml:
        '<Response><Say voice="alice" language="pt-BR" rate="0.8">Olá. Tem paciente aguardando atendimento!</Say></Response>',
    });
    console.log(
      'Ligando para o número',
      `${iAvailability?.professional?.phoneNumber ?? to}`,
    );
    this.logger.info({
      call,
    });
    return call;
  }

  public async statusCall(callSid: string): Promise<string> {
    const call = await this.client.calls(callSid).fetch();
    return call.status;
  }
}
