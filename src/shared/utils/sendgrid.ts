import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface Props {
  to: string;
  subject: string;
  text: string;
  body: string;
}

export const sendgrid = async ({
  to,
  subject,
  text,
  body,
}: Props): Promise<void> => {
  const msg = {
    to, // Change to your recipient
    from: 'sistema@hausey.com.br', // Change to your verified sender
    subject,
    text,
    html: body,
  };
  await sgMail.send(msg).catch(error => console.error(error));
};
