import gql from "graphql-tag";

import { UserError } from "./common";

export interface SubscribeToPayload {
  payload: {
    userErrors: UserError[];
  };
}

export const SUBSCRIBE_TO_EMAIL = gql`
  mutation SUBSCRIBE_TO_EMAIL($email: String!, $list: String, $source: String) {
    payload: subscribeToEmail(
      input: { email: $email, list: $list, source: $source }
    ) {
      userErrors {
        field
        message
      }
    }
  }
`;

export interface SubscribeToReferralInput {
  acceptsEmailMarketing: boolean;
  email: string;
  firstName: string;
  lastName: string;
  source: string;
}

interface SubscribeToReferral {
  portalUrl: string;
  shareUrl: string;
}

export interface SubscribeToReferralPayload {
  payload: {
    subscription: SubscribeToReferral;
    userErrors: UserError[];
  };
}

export const SUBSCRIBE_TO_REFERRAL = gql`
  mutation SUBSCRIBE_TO_REFERRAL(
    $acceptsEmailMarketing: Boolean!
    $email: String!
    $firstName: String
    $lastName: String
    $source: String
  ) {
    payload: subscribeToReferral(
      input: {
        acceptsEmailMarketing: $acceptsEmailMarketing
        email: $email
        firstName: $firstName
        lastName: $lastName
        source: $source
      }
    ) {
      userErrors {
        code
        field
        message
      }
      subscription {
        portalUrl
        shareUrl
      }
    }
  }
`;

export interface SubscribeToSMSInput {
  email?: string;
  phone: string;
  source?: string;
}

export const SUBSCRIBE_TO_SMS = gql`
  mutation SUBSCRIBE_TO_SMS($email: String, $phone: String!, $source: String) {
    payload: subscribeToSMS(
      input: { email: $email, phone: $phone, source: $source }
    ) {
      userErrors {
        field
        message
      }
    }
  }
`;
