export type PaymentInitInput = {
  orderId: string;
  reference: string;
  email: string;
  amountPesewas: number;
  currency: string;
  callbackUrl: string;
};

export type PaymentInitResult = {
  authorizationUrl: string;
  providerReference: string;
};

export type PaymentVerification = {
  success: boolean;
  providerReference: string;
  amountPesewas: number;
  currency: string;
  status: "SUCCEEDED" | "FAILED" | "PENDING" | "CANCELLED";
};

export interface PaymentProvider {
  name: string;
  initialize(input: PaymentInitInput): Promise<PaymentInitResult>;
  verify(reference: string): Promise<PaymentVerification>;
  verifyWebhook?(rawBody: string, signature: string | null): Promise<PaymentVerification | null>;
}
