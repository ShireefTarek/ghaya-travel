import paypal from '@paypal/checkout-server-sdk';
import { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from '../types';

function environment() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal keys missing');
  }
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

export class PayPalProvider implements PaymentProvider {
  private client = new paypal.core.PayPalHttpClient(environment());

  async createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: input.currency,
            value: input.amount.toFixed(2)
          },
          description: input.description
        }
      ]
    });
    const response = await this.client.execute(request);
    const approvalUrl = response.result.links?.find((l: any) => l.rel === 'approve')?.href;
    return {
      id: response.result.id,
      approvalUrl,
      status: response.result.status
    };
  }

  async capturePayment(intentId: string): Promise<PaymentIntentResult> {
    const request = new paypal.orders.OrdersCaptureRequest(intentId);
    request.requestBody({});
    const response = await this.client.execute(request);
    return {
      id: response.result.id,
      status: response.result.status
    };
  }
}
