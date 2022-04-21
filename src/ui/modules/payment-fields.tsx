import {
  composeValidators,
  FieldErrors,
  validateRequired,
  validateStripe,
} from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { Elements } from "@sss/stripe";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { StripeElementStyle } from "@stripe/stripe-js";
import React, { FC } from "react";
import { FormSpy } from "react-final-form";
import { Element } from "react-scroll";

import { percentage, s, useTheme } from "@/common/ui/utils";

import STRIPE_SVG from "../../assets/images/checkout/STRIPE.svg";
import { ORIGIN } from "../../config";
import { Grid, Item } from "../base/grid";
import StyledComponentsHelper from "../base/styled-components-helper";
import { bodyTextSmall } from "../base/typography";
import Errors from "../forms/errors";
import { FormField } from "../forms/field";
import { input } from "../forms/input";
import PaymentCard, {
  isKnownCardBrand,
  PaymentCardBrand,
} from "./payment-card";

const enUsResource = {
  disclaimer: "All transactions are secure and encrypted.",
  fields: {
    cardNumber: {
      label: "Card number",
      required: "Enter a valid card number",
    },
    cardholderName: {
      label: "Name on the card",
      required: "Enter the name exactly as it’s written on the card",
    },
    cvc: {
      label: "Security code (CVC)",
      required: "Enter the 3 or 4 digit code on the back of your card",
    },
    expiry: {
      label: "Expiry",
      required: "Enter a valid expiry date",
    },
  },
};

const stripeFonts = [
  {
    cssSrc: `${ORIGIN}/fonts/fonts.css`,
  },
];
export const StripeElements: FC = ({ children }) => (
  <Elements options={{ fonts: stripeFonts }}>{children}</Elements>
);

interface WrappedElementProps {
  active: boolean;
  disabled: boolean;
  error: FieldErrors | undefined;
  onBlur: (ev: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (ev: React.FocusEvent<HTMLInputElement>) => void;
}

const KNOWN_CARDS = [
  PaymentCardBrand.VISA,
  PaymentCardBrand.MASTERCARD,
  PaymentCardBrand.AMEX,
  PaymentCardBrand.DISCOVER,
  PaymentCardBrand.DINERS,
  PaymentCardBrand.JCB,
];

const makeWrappedElement = (
  Element: React.ComponentType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  displayName: string
) => {
  const WrappedElement: FC<WrappedElementProps> = ({
    active,
    disabled,
    error,
    ...rest
  }) => {
    const t = useTheme();

    const stripeStyle = (error: boolean): StripeElementStyle => ({
      base: {
        "::placeholder": {
          color: t.color.tint.sage,
        },
        color: error ? t.color.state.error : t.color.text.dark.base,
        fontFamily: t.font.primary.family,
        fontSize: "16px",
      },
      invalid: {
        color: t.color.state.error,
      },
    });

    return (
      <StyledComponentsHelper
        as={Element}
        css={s(input({ active, disabled, error: !!error }))}
        options={{
          style: stripeStyle(!!error),
        }}
        {...rest}
      />
    );
  };
  WrappedElement.displayName = `Wrapped${Element.displayName ?? displayName}`;
  return WrappedElement;
};

const WrappedCardNumberElement = makeWrappedElement(
  CardNumberElement,
  "CardNumberElement"
);
const WrappedCardExpiryElement = makeWrappedElement(
  CardExpiryElement,
  "CardExpiryElement"
);
const WrappedCardCvcElement = makeWrappedElement(
  CardCvcElement,
  "CardCvcElement"
);

interface PaymentFieldProps {
  busy: boolean;
  errors?: FieldErrors;
}

const PaymentFields: FC<PaymentFieldProps> = ({ busy, errors }) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "paymentFields", enUsResource);
  const theme = useTheme();

  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => {
        const cardBrand = values?.cardNumber?.brand ?? "unknown";
        const isKnownCard = isKnownCardBrand(cardBrand);

        return (
          <>
            <p
              css={s(bodyTextSmall, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("paymentFields:disclaimer")}
            </p>
            <Element name="payment-error" />
            {!!errors?.length && (
              <Errors
                _css={s((t) => ({
                  marginBottom: t.spacing.md,
                }))}
                errors={errors}
              />
            )}
            <Grid gx={theme.spacing.md} itemWidth="100%">
              <Item
                _css={s((t) => ({
                  alignItems: "flex-end",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: t.spacing.md,
                }))}
              >
                <div
                  css={s((t) => ({
                    display: "inline-block",
                    marginRight: [t.spacing.xs, t.spacing.md],
                  }))}
                >
                  {KNOWN_CARDS.map((brand) => (
                    <PaymentCard
                      key={brand}
                      _css={s((t) => ({
                        filter:
                          isKnownCard && brand !== cardBrand
                            ? "saturate(0)"
                            : "none",
                        paddingRight: [t.spacing.xxs, null, t.spacing.xs],
                        transition: "filter ease-in 300ms",
                        width: percentage(1 / 6),
                      }))}
                      brand={brand}
                    />
                  ))}
                </div>
                <img
                  css={s({
                    maxWidth: "100%",
                    width: [100, 120, 140],
                  })}
                  src={STRIPE_SVG.src}
                />
              </Item>

              <Item>
                <FormField
                  autoComplete="cc-name"
                  busy={busy}
                  data-testid="cardholderName"
                  name="cardholderName"
                  label={t("paymentFields:fields.cardholderName.label")}
                  type="text"
                  validate={composeValidators(
                    validateRequired(
                      t("paymentFields:fields.cardholderName.required")
                    ),
                    validateStripe()
                  )}
                />
              </Item>
              <Item>
                <FormField
                  busy={busy}
                  component={WrappedCardNumberElement}
                  data-testid="cardNumber"
                  label={t("paymentFields:fields.cardNumber.label")}
                  name="cardNumber"
                  type="text"
                  validate={composeValidators(
                    validateRequired(
                      t("paymentFields:fields.cardNumber.required")
                    ),
                    validateStripe()
                  )}
                />
              </Item>
              <Item width="50%">
                <FormField
                  busy={busy}
                  data-testid="expiry"
                  label={t("paymentFields:fields.expiry.label")}
                  name="expiry"
                  component={WrappedCardExpiryElement}
                  validate={composeValidators(
                    validateRequired(t("paymentFields:fields.expiry.required")),
                    validateStripe()
                  )}
                />
              </Item>
              <Item width="50%">
                <FormField
                  busy={busy}
                  data-testid="cvc"
                  label={t("paymentFields:fields.cvc.label")}
                  name="cvc"
                  component={WrappedCardCvcElement}
                  validate={composeValidators(
                    validateRequired(t("paymentFields:fields.cvc.required")),
                    validateStripe()
                  )}
                />
              </Item>
            </Grid>
          </>
        );
      }}
    </FormSpy>
  );
};

export default PaymentFields;
