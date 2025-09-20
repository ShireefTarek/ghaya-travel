import nodemailer from 'nodemailer';

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP credentials missing. Emails will be logged.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return transporter;
}

export async function sendEmail(payload: EmailPayload) {
  const transport = getTransporter();
  if (!transport) {
    console.info('Email payload', payload);
    return;
  }
  await transport.sendMail({
    from: 'Ghaya Travel <no-reply@ghayatravel.com>',
    ...payload
  });
}
