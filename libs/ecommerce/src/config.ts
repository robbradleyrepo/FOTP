import type { CountryCodes } from "./countries";

export interface EcommerceConfig {
  customCheckout: boolean;
  origin: string;
  shippingCountries?: Record<string, CountryCodes[]>;
  shippingThreshold?: number;
  subscriptions: boolean;
}

const ECOMMERCE: EcommerceConfig = {
  customCheckout: true,
  origin: process.env.ORIGIN,
  shippingCountries: {
    "en-US": ["US"],
  },
  shippingThreshold: 25,
  subscriptions: true,
};

export default ECOMMERCE;
