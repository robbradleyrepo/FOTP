import gql from "graphql-tag";

import type { Address } from "./address";

export interface PaymentCard {
  brand: string;
  cardholderName: string;
  expMonth: number;
  expYear: number;
  last4: number;
}

export interface PaymentSource {
  billingAddress: Address;
  card: PaymentCard | null;
  processor: PaymentProcessor;
  status: "ACTIVE" | "FAILED";
  type: PaymentType;
}

export enum PaymentProcessor {
  AUTHORIZE = "AUTHORIZE",
  BRAINTREE = "BRAINTREE",
  STRIPE = "STRIPE",
}

export enum PaymentType {
  APPLE_PAY = "APPLE_PAY",
  CREDIT_CARD = "CREDIT_CARD",
  GOOGLE_PAY = "GOOGLE_PAY",
  PAYPAL = "PAYPAL",
}

export const paymentCardFragment = gql`
  fragment paymentCard on PaymentCard {
    brand
    cardholderName
    expMonth
    expYear
    last4
  }
`;
