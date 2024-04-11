// import nodemailer from 'nodemailer';

interface Props {
  to: string;
  subject: string;
  body: string;
}

export const mailer = async ({ to, subject }: Props): Promise<void> => {
  console.log('EMAIL TO: ', to, ' SUBJECT: ', subject);
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });
  // await transporter.sendMail({
  //   from: `Hausey <${process.env.EMAIL_USER}>`,
  //   to,
  //   subject,
  //   html: body,
  // });
};
