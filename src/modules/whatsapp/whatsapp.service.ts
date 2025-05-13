import { injectable } from 'tsyringe';
import axios from 'axios';

const accountSid = `ACac401000d19daba8dd35008f984c0c85`;
const authToken = `174da56ba644619deb0012ab18491c08`;
const twilioNumber = 'whatsapp:+14155238886'; // Número do sandbox do Twilio

@injectable()
export class WhatsappService {
  public async processIncomingMessage(body: any): Promise<void> {
    const incomingMessage = body.Body?.toLowerCase();
    const toNumber = body.From; // Ex: whatsapp:+55...

    let responseMessage = `Olá, bom dia!\n1 - Deseja ajuda\n2 - Deseja fazer uma doação`;

    if (incomingMessage.includes('1')) {
      responseMessage = `Você escolheu: Ajuda.\nClique aqui para falar com o suporte: https://wa.me/SEU_NUMERO_SUPORTE`;
    } else if (incomingMessage.includes('2')) {
      responseMessage = `Você escolheu: Doação.\nClique aqui para doar: https://wa.me/SEU_NUMERO_DOACAO`;
    }

    await this.sendMessage(toNumber, responseMessage);
  }

  private async sendMessage(to: string, body: string): Promise<void> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    await axios.post(
      url,
      new URLSearchParams({
        From: twilioNumber,
        To: to,
        Body: body,
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
      },
    );
  }
}
