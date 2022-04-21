import { StripeConfig } from "./types";

const STRIPE: StripeConfig = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
};

export default STRIPE;
