import * as SibApiV3Sdk from '@getbrevo/brevo';

interface Props {
  to: string;
  subject: string;
  body: string;
  senderName?: string;
}

export const brevo = async ({
  to,
  subject,
  body,
  senderName = 'Hausey',
}: Props): Promise<void> => {
  const client = new SibApiV3Sdk.TransactionalEmailsApi();

  client.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY as string,
  );

  const sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail = {
    sender: { name: senderName, email: process.env.EMAIL_USER },
    to: [{ email: to }],
    subject,
    htmlContent: body,
  };

  try {
    await client.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    console.error(`[${timestamp}] Erro ao enviar email:`, error);
  }
};
