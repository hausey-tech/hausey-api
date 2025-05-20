import { injectable } from 'tsyringe';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID_CALL;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = 'whatsapp:+14155238886';

@injectable()
export class WhatsappService {
  public async processIncomingMessage(body: any): Promise<void> {
    const incomingMessage = body.Body?.toLowerCase();
    const toNumber = body.From; // Ex: whatsapp:+55...

    let responseMessage = `Olá! 👋 Seja bem-vindo à *Hausey Life*, sua parceira em saúde e bem-estar. 💙

    Como podemos te ajudar hoje?

    Digite apenas o número correspondente à opção desejada:

    1 - Atendimento Comercial 💼
    2 - Suporte Profissional da Saúde 🩺
    3 - Suporte Técnico (TI) 🖥️`;

    if (incomingMessage.trim() === '1') {
      responseMessage = `*Atendimento Comercial* 💼
      Estamos aqui para esclarecer dúvidas sobre planos, valores ou contratação.
      Fale agora com nosso time: https://wa.me/+5511946618532`;
    } else if (incomingMessage.trim() === '2') {
      responseMessage = `*Suporte Profissional da Saúde* 🩺
      Nossa equipe está pronta para te apoiar com orientações médicas.
      Clique aqui para atendimento: https://wa.me/+554398033112`;
    } else if (incomingMessage.trim() === '3') {
      responseMessage = `*Suporte Técnico (TI)* 🖥️
      Está com dificuldades na plataforma? Nosso time técnico pode te ajudar.
      Fale com o suporte: https://wa.me/+5585986354014`;
    } else {
      responseMessage = `Olá! 👋 Seja bem-vindo à *Hausey Life*, sua parceira em saúde e bem-estar. 💙

      Como podemos te ajudar hoje?

      Digite apenas o número correspondente à opção desejada:

      1 - Atendimento Comercial 💼
      2 - Suporte Profissional da Saúde 🩺
      3 - Suporte Técnico (TI) 🖥️`;
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
