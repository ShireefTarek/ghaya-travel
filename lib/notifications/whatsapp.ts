type WhatsAppPayload = {
  to: string;
  template: string;
  components?: any[];
};

export async function sendWhatsApp(payload: WhatsAppPayload) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.info('WhatsApp payload', payload);
    return;
  }
  await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: payload.to,
      type: 'template',
      template: {
        name: payload.template,
        language: { code: 'ar' },
        components: payload.components
      }
    })
  });
}
