import { EC_APP_URL } from '../../../config/brand';

interface Props {
  isEc: boolean;
  holderName: string;
  inviteToken: string;
  kind: 'new' | 'resend';
}

interface InviteEmail {
  senderName: string;
  subject: string;
  body: string;
}

export const buildInviteEmail = ({
  isEc,
  holderName,
  inviteToken,
  kind,
}: Props): InviteEmail => {
  const brandName = isEc ? 'Easy Clinic' : 'Hausey';
  const senderName = brandName;
  const registerUrl = isEc
    ? `${EC_APP_URL}/patient/register?invite=${inviteToken}`
    : `${
        process.env.APP_URL ?? 'https://app.hausey.com'
      }/cadastro?invite=${inviteToken}`;

  const subject =
    kind === 'new'
      ? `Você foi convidado para o plano familiar ${brandName}!`
      : `Novo convite para o plano familiar ${brandName}`;

  const intro =
    kind === 'new'
      ? `<b>${holderName}</b> te convidou para fazer parte do plano familiar ${brandName}.`
      : `<b>${holderName}</b> renovou seu convite para o plano familiar ${brandName}.`;

  const expiryLine = kind === 'new' ? '<p>O convite expira em 7 dias.</p>' : '';

  const body = `
    <h2>Olá!</h2>
    <p>${intro}</p>
    <p>Crie sua conta usando este email e seu acesso será ativado automaticamente.</p>
    ${expiryLine}
    <p><a href="${registerUrl}">Criar minha conta</a></p>
  `;

  return { senderName, subject, body };
};
