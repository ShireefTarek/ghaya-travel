import { PaymentIntentInput, PaymentIntentResult, PaymentProvider } from './types';
import { StripeProvider } from './providers/stripe';
import { PayPalProvider } from './providers/paypal';
import { FawryProvider } from './providers/fawry';

const providers: Record<string, () => PaymentProvider> = {
  stripe: () => new StripeProvider(),
  paypal: () => new PayPalProvider(),
  fawry: () => new FawryProvider()
};

function getDefaultProvider(): PaymentProvider {
  const preferred = process.env.DEFAULT_PAYMENT_PROVIDER?.toLowerCase() || 'stripe';
  const factory = providers[preferred];
  if (!factory) {
    console.warn(`Payment provider ${preferred} not supported. Falling back to mock.`);
    return new FawryProvider();
  }
  try {
    return factory();
  } catch (error) {
    console.warn('Provider init failed, using Fawry mock', error);
    return new FawryProvider();
  }
}

export async function createPayment(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  const provider = getDefaultProvider();
  return provider.createPaymentIntent(input);
}

export async function capturePayment(providerKey: string, intentId: string) {
  const factory = providers[providerKey];
  if (!factory) {
    throw new Error('Unknown payment provider');
  }
  const provider = factory();
  if (!provider.capturePayment) {
    throw new Error('Capture not supported');
  }
  return provider.capturePayment(intentId);
}
