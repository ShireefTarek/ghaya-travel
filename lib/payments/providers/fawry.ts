import { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from '../types';

export class FawryProvider implements PaymentProvider {
  async createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    if (!process.env.FAWRY_API_KEY) {
      console.warn('Fawry API key missing. Using mock payment response.');
      return {
        id: `fawry-mock-${Date.now()}`,
        status: 'succeeded'
      };
    }
    // TODO: integrate with real Fawry API
    return {
      id: `fawry-${Date.now()}`,
      status: 'pending'
    };
  }
}
