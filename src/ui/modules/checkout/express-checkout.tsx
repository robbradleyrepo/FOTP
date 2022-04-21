import { PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { PaymentRequest } from "@stripe/stripe-js";
import React, { FC } from "react";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import Spinner from "../../base/spinner";
import CheckoutTerms from "./terms";

interface ExpressCheckoutButtonProps extends ComponentStyleProps {
  busy?: boolean;
  disabled?: boolean;
  paymentRequest: PaymentRequest;
}

export const ExpressCheckoutButton: FC<ExpressCheckoutButtonProps> = ({
  _css = {},
  busy,
  disabled,
  paymentRequest,
}) => (
  <div
    css={s(
      (t) => ({
        ...((busy || disabled) && { opacity: 0.5, pointerEvents: "none" }),
        color: t.color.text.light.base,
        position: "relative",
        transition: "opacity 500ms",
      }),
      _css
    )}
  >
    <PaymentRequestButtonElement options={{ paymentRequest }} />
    <Spinner
      _css={s((t) => ({
        ...size(t.spacing.md),
        opacity: busy ? 1 : 0,
        transition: "opacity 500ms",
      }))}
    />
  </div>
);

const ExpressCheckout: FC<ExpressCheckoutButtonProps> = ({
  _css = {},
  busy,
  disabled,
  paymentRequest,
}) => (
  <div css={s(_css)}>
    <ExpressCheckoutButton
      busy={busy}
      disabled={disabled}
      paymentRequest={paymentRequest}
    />
    <CheckoutTerms
      _css={s((t) => ({
        marginTop: t.spacing.sm,
      }))}
    />
  </div>
);

export default ExpressCheckout;
