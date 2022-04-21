import { useApolloClient } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import type { Extras } from "@sentry/types";
import { Customer } from "@sss/customer";
import { CountryCodes, ECOMMERCE } from "@sss/ecommerce";
import {
  Checkout,
  CHECKOUT_CHARGE,
  CHECKOUT_UPDATE,
  CheckoutChargeData,
  CheckoutChargeInput,
  CheckoutUpdateData,
  CheckoutUpdateInput,
  getDefaultShippingRate,
  getUpdatedNoteAttributes,
} from "@sss/ecommerce/checkout";
import { useLocale } from "@sss/i18n";
import { useStripe } from "@stripe/react-stripe-js";
import {
  PaymentRequest,
  PaymentRequestItem,
  PaymentRequestPaymentMethodEvent,
  PaymentRequestShippingAddressEvent,
  PaymentRequestShippingOptionEvent,
} from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";

import {
  fromBillingDetails,
  fromPaymentRequestShippingAddress,
  toShippingOption,
  toSmallestCurrencyUnit,
} from "./utils";

export interface UseCheckoutPaymentRequestParams {
  checkout: Checkout;
  customer?: Customer | null;
  onError: (message?: string) => void;
  onSuccess: (checkout: Checkout) => void;
  ready: boolean;
}

export interface UseCheckoutPaymentRequestResult {
  busy: boolean;
  paymentRequest: PaymentRequest | null;
}

export const useCheckoutPaymentRequest = ({
  checkout,
  customer,
  onError,
  onSuccess,
  ready,
}: UseCheckoutPaymentRequestParams): UseCheckoutPaymentRequestResult => {
  const ecommerceConfig = ECOMMERCE;

  const client = useApolloClient();
  const { i18n, locale, t } = useLocale();
  const stripe = useStripe();

  const paymentRequestRef = useRef<PaymentRequest | null>(null);
  const [busy, setBusy] = useState(false);
  const [canMakePayment, setCanMakePayment] = useState(false);

  i18n.addResourceBundle("en-US", "useCheckoutPaymentRequest", {
    complete: {
      label: "Total",
    },
    pending: {
      label: "Subtotal",
    },
  });

  const handleError = (message?: string) => {
    setBusy(false);

    return onError(message);
  };

  const shippingCountries =
    ecommerceConfig.shippingCountries?.[locale.langtag] ?? [];

  useEffect(() => {
    if (!ready || !stripe) {
      return;
    }

    const toTotal = (checkout: Checkout): PaymentRequestItem => {
      const pending = !checkout.shippingRate;

      return {
        amount: toSmallestCurrencyUnit(checkout.totalPrice),
        label: t(
          `useCheckoutPaymentRequest:${pending ? "pending" : "complete"}.label`
        ),
        pending,
      };
    };

    paymentRequestRef.current = stripe.paymentRequest({
      country: locale.countryCode,
      currency: checkout.totalPrice.currencyCode.toLowerCase(),
      requestPayerEmail: !customer,
      requestPayerName: true,
      requestShipping: true,
      shippingOptions: [], // Don't provide any initial shipping options otherwise we might not get the opportunity to validate the address
      total: toTotal(checkout),
    });

    paymentRequestRef.current.on(
      "shippingaddresschange",
      async (event: PaymentRequestShippingAddressEvent) => {
        const extra: Extras = {
          checkoutId: checkout.id,
          event: {
            data: {
              shippingAddress: event.shippingAddress,
            },
            type: "shippingaddresschange",
          },
        };

        try {
          if (
            !shippingCountries.includes(
              event.shippingAddress.country as CountryCodes
            )
          ) {
            event.updateWith({ status: "invalid_shipping_address" });
            return;
          } else {
            const address = fromPaymentRequestShippingAddress(
              event.shippingAddress,
              true
            );

            const input: CheckoutUpdateInput = {
              shippingAddress: { address, partial: true },
            };

            const { data } = await client.mutate<
              CheckoutUpdateData,
              CheckoutUpdateInput
            >({
              mutation: CHECKOUT_UPDATE,
              variables: input,
            });

            if (!data?.payload.rCheckout) {
              extra.update = {
                checkout: data?.payload.rCheckout,
                input,
              };

              throw new Error("Unable to set shipping address");
            }

            let checkout: Checkout = data?.payload.rCheckout;
            let shippingRate = checkout.shippingRate;

            extra.checkout = checkout;

            // Set the default shipping rate if one isn't already selected
            if (
              checkout?.availableShippingRates?.shippingRates &&
              !shippingRate
            ) {
              shippingRate = getDefaultShippingRate(
                checkout.availableShippingRates.shippingRates
              );

              if (!shippingRate) {
                // This shouldn't happen unless the server returns an empty array of shipping rates
                throw new Error("Unable to find default shipping rate");
              }

              const input = {
                shippingRate: { handle: shippingRate.handle },
              };

              const { data } = await client.mutate<
                CheckoutUpdateData,
                CheckoutUpdateInput
              >({
                mutation: CHECKOUT_UPDATE,
                variables: input,
              });

              if (!data?.payload.rCheckout) {
                extra.update = {
                  checkout: data?.payload.rCheckout,
                  input,
                };

                throw Error("Unable to set shipping rate");
              }

              checkout = data.payload.rCheckout;
              extra.checkout = checkout;
            }

            if (
              !checkout?.availableShippingRates?.shippingRates ||
              !shippingRate
            ) {
              event.updateWith({ status: "invalid_shipping_address" });
              return;
            }

            event.updateWith({
              shippingOptions: checkout.availableShippingRates?.shippingRates.map(
                (rate) => ({
                  ...toShippingOption(rate),
                  selected: rate.handle === shippingRate?.handle,
                })
              ),
              status: "success",
              total: toTotal(checkout),
            });
            return;
          }
        } catch (error) {
          captureException(error, { extra });
        }

        event.updateWith({
          status: "fail",
        });
      }
    );

    paymentRequestRef.current.on(
      "shippingoptionchange",
      async (event: PaymentRequestShippingOptionEvent) => {
        const extra: Extras = {
          checkoutId: checkout.id,
          event: {
            data: { shippingOption: event.shippingOption },
            type: "shippingoptionchange",
          },
        };

        try {
          const input: CheckoutUpdateInput = {
            shippingRate: { handle: event.shippingOption.id },
          };

          const { data } = await client.mutate<
            CheckoutUpdateData,
            CheckoutUpdateInput
          >({
            mutation: CHECKOUT_UPDATE,
            variables: input,
          });

          if (!data?.payload.rCheckout) {
            extra.update = {
              checkout: data?.payload.rCheckout,
              input,
            };

            throw Error("Unable to set shipping rate");
          }

          event.updateWith({
            status: "success",
            total: toTotal(data.payload.rCheckout),
          });
          return;
        } catch (error) {
          captureException(error, { extra });
        }

        event.updateWith({
          status: "fail",
        });
      }
    );

    paymentRequestRef.current.on(
      "paymentmethod",
      async (event: PaymentRequestPaymentMethodEvent) => {
        const extra: Extras = {
          checkoutId: checkout.id,
          event: {
            type: "paymentmethod",
          },
        };

        const {
          payerEmail,
          paymentMethod,
          payerName: name,
          payerPhone: phone,
          shippingAddress,
          shippingOption,
        } = event;

        try {
          if (!customer && !payerEmail) {
            event.complete("invalid_payer_email");
            return;
          }

          if (!name) {
            event.complete("invalid_payer_name");
            return;
          }

          if (!shippingAddress) {
            event.complete("invalid_shipping_address");
            return;
          }

          if (!paymentMethod.billing_details.address) {
            throw new Error("Missing billing details");
          }

          if (!shippingOption) {
            throw new Error("Missing shipping option");
          }

          const email = customer?.email ?? payerEmail;

          if (!email) {
            extra.customer = customer;

            throw new Error("Missing customer email address");
          }

          let input: CheckoutUpdateInput = {
            billingAddress: {
              address: fromBillingDetails({
                address: paymentMethod.billing_details.address,
                name,
                phone: phone ?? "",
              }),
            },
            noteAttributes: getUpdatedNoteAttributes(checkout, {
              original_billing_name: name,
              original_shipping_name: shippingAddress.recipient ?? "",
            }),
            shippingAddress: {
              address: fromPaymentRequestShippingAddress(shippingAddress),
            },
            shippingRate: { handle: shippingOption.id },
          };

          if (!customer) {
            input = { ...input, email: { email } };
          }

          const updateCheckout = await client.mutate<
            CheckoutUpdateData,
            CheckoutUpdateInput
          >({
            mutation: CHECKOUT_UPDATE,
            variables: input,
          });

          if (updateCheckout.data?.payload.userErrors.length) {
            throw new Error("Unable to update checkout with provided details");
          }

          if (!updateCheckout.data?.payload.rCheckout?.ready) {
            extra.update = {
              checkout: updateCheckout.data?.payload.rCheckout,
              input,
              mutation: "CHECKOUT_UPDATE",
            };

            throw new Error("Checkout is not ready for payment");
          }
        } catch (error) {
          captureException(error, { extra });
          event.complete("fail");
          return;
        }

        // Mark the payment as a success, as we've handled everything we can
        // using the payment request interface
        event.complete("success");
        setBusy(true);

        try {
          const attemptCharge = async (
            token: string,
            authorizationToken?: string
          ) => {
            const { data } = await client.mutate<
              CheckoutChargeData,
              CheckoutChargeInput
            >({
              mutation: CHECKOUT_CHARGE,
              variables: {
                authorizationToken,
                token,
              },
            });

            if (!data?.payload.rCheckout) {
              throw new Error("Invalid response from API");
            }
            return data;
          };

          let chargeResult = await attemptCharge(paymentMethod.id);

          if (chargeResult?.payload.userErrors?.length) {
            throw new Error("Unable to process charge");
          }

          if (chargeResult.payload.authorizationToken) {
            // We require additional authentication for SCA
            const stripeAuthResult = await stripe?.handleCardAction(
              chargeResult.payload.authorizationToken
            );

            if (stripeAuthResult?.error?.message) {
              handleError(stripeAuthResult.error.message);
              return;
            } else if (!stripeAuthResult.paymentIntent?.payment_method) {
              // should not happen
              throw new Error(
                "handleCardAction succeeded but did not return a payment method."
              );
            } else {
              // SCA succeeded, attempt payment again.
              chargeResult = await attemptCharge(
                stripeAuthResult.paymentIntent.payment_method,
                stripeAuthResult.paymentIntent.id
              );
              if (chargeResult?.payload.userErrors?.length) {
                throw new Error("Unable to process charge");
              } else if (chargeResult?.payload.authorizationToken) {
                throw new Error(
                  "`handleCardAction` succeeded but backend requested SCA again"
                );
              }
            }
          }

          if (!chargeResult?.payload?.rCheckout?.completedAt) {
            // We should always receive a completed checkout object
            throw new Error("Invalid response from API");
          }

          onSuccess(chargeResult?.payload?.rCheckout);
        } catch (error) {
          captureException(error, { extra });
          handleError();
        }

        setBusy(false);
      }
    );

    paymentRequestRef.current
      .canMakePayment()
      .then((result) => setCanMakePayment(!!result));
  }, [ready, stripe]);

  return {
    busy,
    paymentRequest: canMakePayment ? paymentRequestRef.current : null,
  };
};
