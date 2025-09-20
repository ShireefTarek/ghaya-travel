import twilio from 'twilio';

type SmsPayload = {
  to: string;
  body: string;
};

export async function sendSms(payload: SmsPayload) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.info('SMS payload', payload);
    return;
  }
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    from: process.env.TWILIO_FROM || '+00000000',
    to: payload.to,
    body: payload.body
  });
}
