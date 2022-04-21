import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { ExtendedError } from "@sentry/types";
import { dataLayerTrack } from "@sss/analytics";
import { FormatAddress } from "@sss/ecommerce/address";
import { trackAddPaymentInfoEvent } from "@sss/ecommerce/analytics";
import {
  CHECKOUT_CHARGE,
  CHECKOUT_UPDATE,
  CheckoutChargeData,
  CheckoutChargeInput,
  CheckoutUpdateData,
  CheckoutUpdateInput,
  getDefaultShippingRate,
} from "@sss/ecommerce/checkout";
import { moneyFns, Property } from "@sss/ecommerce/common";
import { getUserErrorsMapper, removeEmptyFields } from "@sss/forms";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { toBillingDetails } from "@sss/stripe";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { AnyObject } from "final-form";
import { FORM_ERROR } from "final-form";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { FormSpy, FormSpyProps } from "react-final-form";
import { Field } from "react-final-form";
import { Element, scroller } from "react-scroll";
import { FormField } from "src/ui/forms/field";

import {
  ComponentStyleProps,
  link,
  linkReverse,
  my,
  percentage,
  px,
  s,
  size,
} from "@/common/ui/utils";

import { primaryButton } from "../../../base/button";
import { Grid, Item } from "../../../base/grid";
import Icon from "../../../base/icon";
import { note, NoteType } from "../../../base/note";
import Spinner from "../../../base/spinner";
import {
  bodyTextExtraSmallStatic,
  headingDelta,
  headingEchoStatic,
} from "../../../base/typography";
import Form from "../../../forms/form";
import RadioField from "../../../forms/radio-field";
import chevronLeft from "../../../icons/chevronLeft";
import { theme } from "../../../styles/theme";
import AddressFields from "../../address-fields";
import PaymentFields from "../../payment-fields";
import { CheckoutStepProps, section, useHasCompletedCheckout } from "../common";
import CheckoutTerms from "../terms";

const enUsResource = {
  billing: {
    different: "Use a different billing address",
    same: "Same as shipping address",
    title: "Billing address",
  },
  error: {
    text: "Something has gone wrong. Please contact support:",
  },
  hearAboutUs: {
    emptyOption: "Select an option",
    fieldAria: "How did you hear about us?",
    options: {
      billboard: "A billboard",
      blog_post: "I read an article about you",
      direct_mail: "I received a flyer/postcard in the mail",
      facebook_ad: "I saw a Facebook ad",
      friend: "A Friend",
      google: "I searched on google",
      noOption: "Select an option",
      other: "Other",
      social_follow: "I follow you on social media",
      social_post: "I found you through someone on social media",
      tv: "A TV ad",
      youtube_channel: "I saw your Youtube channel",
    },
    title: "How did you hear about us?",
  },
  next: "Pay now",
  payment: {
    title: "Payment",
  },
  previous: "Return to information",
  shipping: {
    free: "Free",
    none: {
      text:
        "Unfortunately we are unable to ship to your address. Please change your shipping address above, to continue with payment. Or contact us:",
    },
    title: "Shipping method",
  },
  shippingDetails: "Shipping details",
  summary: {
    change: "Change",
    contact: "Contact",
    shipping: "Ship to",
  },
};

const scrollTo = (name: string) =>
  scroller.scrollTo(name, {
    duration: 500,
    offset: -32,
    smooth: true,
  });

enum BillingAddressType {
  DIFFERENT = "different",
  SAME = "same",
}

interface HowDidYouHearAboutUsProps {
  options: { value: string; label: string }[];
  emptyOptionLabel: string;
  title: string;
  fieldAria: string;
}

interface HandleNewNoteAttributesProps {
  newNote: Property;
  notes: Property[] | null;
}

const handleNewNoteAttributes = ({
  newNote,
  notes,
}: HandleNewNoteAttributesProps) => {
  if (newNote && Array.isArray(notes)) {
    return [
      ...notes.map((i) => ({
        name: i.name,
        value: i.value,
      })),
      newNote,
    ];
  }

  return [newNote];
};

const HowDidYouHearAboutUs: FC<HowDidYouHearAboutUsProps> = ({
  options,
  emptyOptionLabel,
  title,
  fieldAria,
}) => {
  return (
    <fieldset>
      <legend
        css={s(headingDelta, (t) => ({
          marginBottom: t.spacing.md,
        }))}
      >
        {title}
      </legend>

      <FormField
        busy={false}
        data-testid="hearAboutUs"
        name="hearAboutUs"
        ariaLabel={fieldAria}
        type="select"
      >
        <option disabled value="">
          {emptyOptionLabel}
        </option>

        {options.map(({ value, label }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </FormField>
    </fieldset>
  );
};

const CheckoutStepPayment: FC<CheckoutStepProps & ComponentStyleProps> = ({
  _css = {},
  checkout,
  onComplete,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const client = useApolloClient();
  const formatCurrency = useCurrencyFormatter();
  const { setHasCompletedCheckout } = useHasCompletedCheckout();
  const { i18n, locale, t } = useLocale();
  const [
    shippingRateUpdate,
    shippingRateUpdateResult,
  ] = useMutation<CheckoutUpdateData>(CHECKOUT_UPDATE);
  const hasCompletedPaymentInfoRef = useRef(false);

  i18n.addResourceBundle("en-US", "checkoutStepPayment", enUsResource);

  const {
    availableShippingRates,
    completedAt,
    email,
    id,
    shippingAddress,
    shippingRate,
    noteAttributes,
  } = checkout;

  // Sanity check / type guard
  if (
    !availableShippingRates?.ready ||
    completedAt ||
    !email ||
    !shippingAddress
  ) {
    // We shouldn't hit this error as the user should be redirected during
    // `getInitialProps` or checkout completion. If we do, it's likely due
    // to the current checkout data being updated with the completed checkout's
    throw new Error(`Invalid checkout data (ID: ${id})`);
  }

  useEffect(() => {
    trackAddPaymentInfoEvent(checkout);
  }, []);

  // Prevent the form from reinitializing when we lazily update
  const initialValues = useMemo(
    () =>
      removeEmptyFields({
        ...(checkout.billingAddress ?? {}),
        billingAddressType: checkout.billingAddress
          ? BillingAddressType.DIFFERENT
          : BillingAddressType.SAME,
        countryCode: locale.region.toUpperCase(),
        hearAboutUs: "",
        shippingRate:
          shippingRate?.handle ??
          (availableShippingRates.shippingRates &&
            getDefaultShippingRate(availableShippingRates.shippingRates)
              ?.handle),
      }),
    []
  );

  if (!elements || !stripe) {
    // Stripe is still loading.
    return null;
  }

  const handleChange: FormSpyProps["onChange"] = ({
    errors,
    touched = {},
    values,
  }) => {
    if (values?.shippingRate && values.shippingRate !== shippingRate?.handle) {
      shippingRateUpdate({
        variables: { shippingRate: { handle: values.shippingRate } },
      });
    }

    if (
      !hasCompletedPaymentInfoRef.current &&
      !["cardNumber", "cardholderName", "cvc", "expiry"].some(
        // No fields should have errors and all must be touched
        (field) => field in errors || !touched[field]
      )
    ) {
      dataLayerTrack({
        event: "payment_info_entered",
      });
      hasCompletedPaymentInfoRef.current = true;
    }
  };

  const handleSubmit = async ({
    billingAddressType,
    cardholderName,
    shippingRate,
    ...values
  }: AnyObject) => {
    try {
      const {
        address1,
        address2,
        city,
        company,
        countryCode,
        firstName,
        lastName,
        phone,
        province,
        zip,
      } =
        billingAddressType === BillingAddressType.DIFFERENT
          ? values
          : removeEmptyFields(checkout.shippingAddress ?? {});

      const billingAddress = {
        address1,
        address2,
        city,
        company,
        countryCode,
        firstName,
        lastName,
        phone,
        province,
        zip,
      };

      const input = {
        ...(billingAddressType === BillingAddressType.DIFFERENT && {
          billingAddress: { address: billingAddress },
        }),
        noteAttributes: handleNewNoteAttributes({
          newNote: {
            name: "hearAboutUs",
            value: values.hearAboutUs,
          },
          notes: noteAttributes,
        }),
        shippingRate: { handle: shippingRate },
      };

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Stripe CardNumberElement is currently unavailable");
      }

      const [stripeResult, checkoutUpdateResult] = await Promise.all([
        stripe.createPaymentMethod({
          billing_details: toBillingDetails({
            address: billingAddress,
            cardholderName,
            email,
          }),
          card: cardElement,
          type: "card",
        }),
        client.mutate<CheckoutUpdateData, CheckoutUpdateInput>({
          mutation: CHECKOUT_UPDATE,
          variables: input,
        }),
      ]);

      if (stripeResult.error?.message) {
        scrollTo("payment-error");

        return {
          payment: [stripeResult.error.message],
        };
      } else if (!stripeResult?.paymentMethod) {
        // This should never happen according to the docs
        throw new Error(
          "createPaymentMethod succeeded but did not return a payment method."
        );
      }

      if (checkoutUpdateResult.data?.payload.userErrors?.length) {
        const errorMapper = getUserErrorsMapper({
          billingAddress: {
            address1: "address1",
            address2: "address2",
            city: "city",
            company: "company",
            countryCode: "countryCode",
            firstName: "firstName",
            lastName: "lastName",
            phone: "phone",
            province: "province",
            zip: "zip",
          },
        });

        return errorMapper(checkoutUpdateResult.data.payload.userErrors);
      }

      if (!checkoutUpdateResult.data?.payload.rCheckout?.ready) {
        // We shouldn't hit this unless there's an error in the form validation
        // or a problem on the backend
        const error: ExtendedError = new Error("Unprocessable checkout data");

        error.checkout = checkoutUpdateResult.data?.payload.rCheckout;
        error.input = input;

        throw error;
      }

      const attemptCharge = async (
        paymentMethodId: string,
        paymentIntentId?: string
      ) => {
        const { data } = await client.mutate<
          CheckoutChargeData,
          CheckoutChargeInput
        >({
          mutation: CHECKOUT_CHARGE,
          variables: {
            authorizationToken: paymentIntentId,
            token: paymentMethodId,
          },
        });

        if (!data?.payload.rCheckout) {
          throw new Error("Invalid response from API");
        }
        return data;
      };

      let chargeResult = await attemptCharge(stripeResult.paymentMethod.id);

      if (chargeResult?.payload.userErrors?.length) {
        scrollTo("payment-error");
        return {
          payment: chargeResult.payload.userErrors.map(
            ({ message }) => message
          ),
        };
      }

      if (chargeResult.payload.authorizationToken) {
        // We require additional authentication for SCA
        const stripeAuthResult = await stripe?.handleCardAction(
          chargeResult.payload.authorizationToken
        );

        if (stripeAuthResult?.error?.message) {
          // SCA failed
          scrollTo("payment-error");
          return {
            payment: [stripeAuthResult.error.message],
          };
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
            scrollTo("checkout-payment-form");
            return {
              payment: chargeResult.payload.userErrors.map(
                ({ message }) => message
              ),
            };
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

      // Success!
      setHasCompletedCheckout(true);
      onComplete?.(chargeResult.payload.rCheckout);
    } catch (error) {
      captureException(error);

      scrollTo("checkout-payment-form");

      return {
        [FORM_ERROR]: [
          <>
            {t("checkoutStepPayment:error.text")}{" "}
            <a css={s(link)} href={`mailto:${t("common:email")}`}>
              {t("common:email")}
            </a>
          </>,
        ],
      };
    }
  };

  return (
    <>
      <Element name="checkout-payment-form" />
      <Form
        _css={s(_css)}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ busy }) => (
          <>
            <FormSpy
              subscription={{ errors: true, touched: true, values: true }}
              onChange={handleChange}
            />

            <HowDidYouHearAboutUs
              emptyOptionLabel={t(
                "checkoutStepPayment:hearAboutUs.emptyOption"
              )}
              fieldAria={t("checkoutStepPayment:hearAboutUs.fieldAria")}
              options={[
                "google",
                "facebook_ad",
                "friend",
                "social_post",
                "social_follow",
                "direct_mail",
                "youtube_channel",
                "blog_post",
                "tv",
                "billboard",
                "other",
              ].map((i) => ({
                label: t(`checkoutStepPayment:hearAboutUs.options.${i}`),
                value: i,
              }))}
              title={t("checkoutStepPayment:hearAboutUs.title")}
            />
            <fieldset>
              <legend
                css={s(headingDelta, (t) => ({
                  marginBottom: t.spacing.md,
                }))}
              >
                {t("checkoutStepPayment:shippingDetails")}
              </legend>

              <dl css={s(section)}>
                {[
                  { key: "contact", value: email },
                  {
                    key: "shipping",
                    value: checkout.shippingAddress && (
                      <FormatAddress
                        address={checkout.shippingAddress}
                        lines={[
                          "address1",
                          "address2",
                          "city",
                          "province",
                          "country",
                          "zip",
                        ]}
                        separator=", "
                      />
                    ),
                  },
                ].map(({ key, value }, index, arr) => (
                  <div
                    key={key}
                    css={s((t) => ({
                      ...(index !== arr.length - 1 && {
                        borderBottomColor: t.color.border.light,
                        borderBottomStyle: "solid",
                        borderBottomWidth: 1,
                        marginBottom: t.spacing.sm,
                        paddingBottom: t.spacing.sm,
                      }),
                      paddingRight: t.spacing.xxl,
                      position: "relative",
                    }))}
                  >
                    <dt
                      css={s(bodyTextExtraSmallStatic, {
                        opacity: 0.5,
                      })}
                    >
                      {t(`checkoutStepPayment:summary.${key}`)}
                    </dt>
                    <dd>
                      {value}
                      <Link
                        css={s(headingEchoStatic, linkReverse, {
                          position: "absolute",
                          right: 0,
                          top: 0,
                        })}
                        to="/checkout/information"
                      >
                        {t("checkoutStepPayment:summary.change")}
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            </fieldset>
            <fieldset
              css={s((t) => ({
                marginTop: t.spacing.lg,
              }))}
            >
              <legend css={s(headingDelta, { display: "block" })}>
                {t("checkoutStepPayment:shipping.title")}
              </legend>
              {availableShippingRates?.shippingRates?.length ? (
                <div css={s(section, (t) => ({ marginTop: t.spacing.md }))}>
                  {availableShippingRates.shippingRates.map(
                    ({ handle, price, title }) => (
                      <RadioField
                        key={handle}
                        busy={busy || shippingRateUpdateResult.loading}
                        name="shippingRate"
                        label={
                          <span
                            css={s({
                              display: "flex",
                            })}
                          >
                            <span
                              css={s({
                                flexGrow: 1,
                              })}
                            >
                              {title}
                            </span>
                            <span
                              css={s({
                                flexShrink: 0,
                                textTransform: "uppercase",
                              })}
                            >
                              {moneyFns.toFloat(price) > 0
                                ? formatCurrency(price)
                                : t("checkoutStepPayment:shipping.free")}
                            </span>
                          </span>
                        }
                        value={handle}
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  css={s(note(NoteType.ERROR), (t) => ({
                    marginTop: t.spacing.md,
                  }))}
                >
                  {t("checkoutStepPayment:shipping.none.text")}{" "}
                  <a css={s(link)} href={`mailto:${t("common:email")}`}>
                    {t("common:email")}
                  </a>
                </div>
              )}
            </fieldset>
            <fieldset
              css={s((t) => ({
                marginTop: t.spacing.lg,
              }))}
            >
              <legend
                css={s(headingDelta, (t) => ({
                  display: "block",
                  marginBottom: t.spacing.xs,
                }))}
              >
                {t("checkoutStepPayment:payment.title")}
              </legend>

              <Field name="payment">
                {({ meta: { dirtySinceLastSubmit, submitError } }) => (
                  <PaymentFields
                    busy={busy}
                    errors={
                      !!submitError?.length && !dirtySinceLastSubmit
                        ? submitError
                        : undefined
                    }
                  />
                )}
              </Field>
            </fieldset>
            <fieldset
              css={s((t) => ({
                marginTop: t.spacing.lg,
              }))}
            >
              <legend
                css={s(headingDelta, {
                  display: "block",
                })}
              >
                {t("checkoutStepPayment:billing.title")}
              </legend>
              <div css={s(section, (t) => ({ marginTop: t.spacing.md }))}>
                <RadioField
                  busy={busy}
                  name="billingAddressType"
                  label={t(
                    `checkoutStepPayment:billing.${BillingAddressType.SAME}`
                  )}
                  value={BillingAddressType.SAME}
                />
              </div>
              <div css={s(section, { borderTopWidth: 0 })}>
                <RadioField
                  busy={busy}
                  name="billingAddressType"
                  label={t(
                    `checkoutStepPayment:billing.${BillingAddressType.DIFFERENT}`
                  )}
                  value={BillingAddressType.DIFFERENT}
                />
                <Field name="billingAddressType">
                  {({ input: { value } }) =>
                    value === BillingAddressType.DIFFERENT ? (
                      <AddressFields
                        _css={s((t) => my(t.spacing.md))}
                        busy={busy}
                        section="billing"
                      />
                    ) : (
                      <div />
                    )
                  }
                </Field>
              </div>
            </fieldset>
            <CheckoutTerms
              _css={s((t) => ({
                marginTop: t.spacing.md,
                textAlign: ["center", null, "left"],
              }))}
            />
            <Grid
              _css={s((t) => ({
                marginTop: [t.spacing.md, null, t.spacing.lg],
              }))}
              direction="rtl"
              innerCss={s({ alignItems: "center" })}
              itemWidth={[percentage(1), null, null, percentage(1 / 2)]}
              gx={theme.spacing.md}
              gy={theme.spacing.lg}
            >
              {availableShippingRates?.shippingRates?.length ? (
                <Item>
                  <button
                    css={s(
                      primaryButton({
                        disabled: busy || shippingRateUpdateResult.loading,
                      }),
                      (t) => ({
                        position: "relative",
                        ...px(t.spacing.sm),
                        width: "100%",
                      })
                    )}
                    disabled={busy || shippingRateUpdateResult.loading}
                  >
                    <span
                      css={s({
                        display: "block",
                        opacity: busy ? 0.5 : 1,
                        transition: "opacity 500ms",
                      })}
                    >
                      {t("checkoutStepPayment:next")}
                    </span>
                    <Spinner
                      _css={s({
                        opacity: busy ? 1 : 0,
                        transition: "opacity 500ms",
                      })}
                    />
                  </button>
                </Item>
              ) : null}
              <Item _css={s({ textAlign: ["center", null, null, "inherit"] })}>
                <Link
                  css={s(headingEchoStatic, linkReverse)}
                  to="/checkout/information"
                >
                  <Icon
                    _css={s((t) => ({
                      ...size(8),
                      marginRight: t.spacing.xs,
                      verticalAlign: "baseline",
                    }))}
                    path={chevronLeft}
                  />
                  {t("checkoutStepPayment:previous")}
                </Link>
              </Item>
            </Grid>
          </>
        )}
      </Form>
    </>
  );
};

export default CheckoutStepPayment;
