import Stripe from 'stripe';
import { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from '../types';

export class StripeProvider implements PaymentProvider {
  private client: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key missing');
    }
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    const intent = await this.client.paymentIntents.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency.toLowerCase(),
      receipt_email: input.customerEmail,
      description: input.description,
      metadata: input.metadata,
      automatic_payment_methods: { enabled: true }
    });
    return {
      id: intent.id,
      clientSecret: intent.client_secret || undefined,
      status: intent.status
    };
  }

  async capturePayment(intentId: string): Promise<PaymentIntentResult> {
    const intent = await this.client.paymentIntents.capture(intentId);
    return {
      id: intent.id,
      clientSecret: intent.client_secret || undefined,
      status: intent.status
    };
  }
}
