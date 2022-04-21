import { useApolloClient } from "@apollo/react-hooks";
import { CHECKOUT, Checkout } from "@sss/ecommerce/checkout";
import { useOnUnmount } from "@sss/hooks";
import { useCallback, useRef } from "react";

import { belt as _belt, px, py, s, StyleFn } from "@/common/ui/utils";

export enum CheckoutStep {
  INFORMATION = "information",
  PAYMENT = "payment",
  THANKS = "thank_you",
}

export interface CheckoutStepProps {
  checkout: Checkout;
  onComplete?: (checkout: Checkout) => void;
}

export const belt = s(_belt, { maxWidth: 1100 });

export const height = {
  header: [68, null, 140],
  summary: 60,
};

export const section: StyleFn = (t) => ({
  ...px([t.spacing.sm, null, t.spacing.md]),
  ...py(t.spacing.sm),
  borderColor: t.color.border.light,
  borderStyle: "solid",
  borderWidth: 1,
});

export const isCheckoutStepReady = (
  checkout: Checkout,
  step: CheckoutStep
): boolean => {
  // We can omit `thanks` from the possible steps, as we can't load it without
  // an explicit token
  switch (step) {
    case "payment":
      return !!checkout.email && checkout.availableShippingRates?.ready;
    case "information":
      return checkout.itemCount > 0;
    default:
      return false;
  }
};

export const getCheckoutStep = (
  checkout: Checkout,
  requestedStep: CheckoutStep
): CheckoutStep | null => {
  const steps = Object.values(CheckoutStep);
  let lastValidStep: CheckoutStep | null = null;

  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];

    if (
      lastValidStep === requestedStep ||
      !isCheckoutStepReady(checkout, step)
    ) {
      break;
    }

    lastValidStep = step;
  }

  return lastValidStep;
};

export const useHasCompletedCheckout = () => {
  const client = useApolloClient();
  const hasCompletedCheckoutRef = useRef(false);

  const setHasCompletedCheckout = useCallback((value: boolean) => {
    hasCompletedCheckoutRef.current = value;
  }, []);

  useOnUnmount(() => {
    // Use a ref to ensure this runs with the correct value even if the
    // component unmounts immediately
    if (hasCompletedCheckoutRef.current) {
      client.writeQuery({ data: { rCheckout: null }, query: CHECKOUT });
    }
  });

  return {
    hasCompletedCheckout: hasCompletedCheckoutRef.current,
    setHasCompletedCheckout,
  };
};
