export type PaymentIntentInput = {
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
  metadata?: Record<string, string>;
};

export type PaymentIntentResult = {
  id: string;
  clientSecret?: string;
  approvalUrl?: string;
  status: string;
};

export interface PaymentProvider {
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
  capturePayment?(intentId: string): Promise<PaymentIntentResult>;
}
