import { Elements as StripeElements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import React, { FC } from "react";

import STRIPE from "./config";

export const Elements: FC<{ options?: StripeElementsOptions }> = ({
  children,
  ...rest
}) => {
  const stripePromise = loadStripe(STRIPE.publishableKey, { locale: "auto" });

  return (
    <StripeElements stripe={stripePromise} {...rest}>
      {children}
    </StripeElements>
  );
};
