import { useMutation } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { ExtendedError } from "@sentry/types";
import { dataLayerTrack } from "@sss/analytics";
import { useCustomer } from "@sss/customer";
import { Countries } from "@sss/ecommerce";
import { ECOMMERCE } from "@sss/ecommerce";
import {
  trackAddShippingInfoEvent,
  trackBeginCheckoutEvent,
} from "@sss/ecommerce/analytics";
import {
  CHECKOUT_UPDATE,
  CheckoutEmailInput,
  CheckoutUpdateData,
  CheckoutUpdateInput,
} from "@sss/ecommerce/checkout";
import {
  SUBSCRIBE_TO_SMS,
  SubscribeToPayload,
  SubscribeToSMSInput,
} from "@sss/ecommerce/subscribe";
import {
  getUserErrorsMapper,
  removeEmptyFields,
  validateEmail,
} from "@sss/forms";
import { useConditionalUpdate } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { captureDetailedException } from "@sss/sentry";
import { useCheckoutPaymentRequest } from "@sss/stripe";
import { AnyObject } from "final-form";
import isEqual from "lodash.isequal";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { FormSpy, FormSpyProps } from "react-final-form";
import { Trans } from "react-i18next";

import {
  ComponentStyleProps,
  link,
  linkReverse,
  percentage,
  px,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import { primaryButton } from "../../../base/button";
import Divider from "../../../base/divider";
import { Grid, Item } from "../../../base/grid";
import Icon from "../../../base/icon";
import Spinner from "../../../base/spinner";
import { ToastType, useToastController } from "../../../base/toast";
import { headingDelta, headingEchoStatic } from "../../../base/typography";
import CheckboxField from "../../../forms/checkbox-field";
import Field from "../../../forms/field";
import Form from "../../../forms/form";
import chevronLeft from "../../../icons/chevronLeft";
import { theme } from "../../../styles/theme";
import AddressFields from "../../address-fields";
import {
  CheckoutStep,
  CheckoutStepProps,
  isCheckoutStepReady,
  useHasCompletedCheckout,
} from "../common";
import ExpressCheckout from "../express-checkout";

const enUsResource = {
  contact: {
    field: {
      acceptsEmailMarketing: {
        label:
          "I’d like to receive exclusive email offers, plus vet-approved tips and training for my dog.",
      },
      acceptsSMSMarketing: {
        disclaimer:
          "By checking this box, you agree to receive recurring automated promotional and personalized marketing text messages <strong>(e.g. cart reminders)</strong> from Front Of The Pack at the cell number used when signing up. Consent is not a condition of any purchase. <strong>Reply HELP for help and STOP to cancel</strong>. Msg frequency varies. Msg & data rates may apply. View <TermsLink>Terms</TermsLink> & <PrivacyLink>Privacy</PrivacyLink>.",
        label:
          "<strong>Join the Pack!</strong> Sign up for text-only discounts, order updates and vet-recommended tips for a healthy dog.",
      },
      email: {
        error: "Please enter a valid email address",
        label: "Email",
      },
    },
    strapline: {
      auth: "Logged in as",
    },
    title: "Contact information",
  },
  error: "Something has goes wrong. Please contact support.",
  express: {
    alternative: "or",
    title: "Express checkout",
  },
  next: "Continue to payment",
  previous: "Return to cart",
  shipping: {
    title: "Shipping address",
  },
};

type CheckoutStepInformationForm = CheckoutEmailInput;

const CheckoutStepInformation: FC<CheckoutStepProps & ComponentStyleProps> = ({
  _css = {},
  checkout,
  onComplete,
}) => {
  const { customer, loading: customerLoading } = useCustomer();
  const {
    hasCompletedCheckout,
    setHasCompletedCheckout,
  } = useHasCompletedCheckout();
  const [subscribeToSMS] = useMutation<SubscribeToPayload, SubscribeToSMSInput>(
    SUBSCRIBE_TO_SMS
  );
  const [checkoutUpdate] = useMutation<CheckoutUpdateData>(CHECKOUT_UPDATE);
  const { i18n, locale, t } = useLocale();
  const hasStartedShippingRef = useRef(false);
  const router = useRouter();
  const toast = useToastController();

  const {
    busy: busyPaymentRequest,
    paymentRequest,
  } = useCheckoutPaymentRequest({
    checkout,
    customer,
    onError: (message) =>
      toast.push({
        children: message ?? t("checkoutStepInformation:error"),
        type: ToastType.ERROR,
      }),
    onSuccess: (checkout) => {
      setHasCompletedCheckout(true);
      onComplete?.(checkout);
    },
    ready: !customerLoading,
  });

  i18n.addResourceBundle("en-US", "checkoutStepInformation", enUsResource);

  const { acceptsEmailMarketing, email } = checkout;

  useEffect(() => {
    trackBeginCheckoutEvent(checkout);
  }, []);

  // Prevent the form from reinitializing when we lazily update
  const initialValues = useMemo(
    () =>
      removeEmptyFields({
        ...(checkout.shippingAddress ?? {}),
        // We want to default to `true`, but ReCharge defaults to `false`.
        // We'll ignore the value from the checkout unless it includes a
        // shipping address, as this indicates that the user has previously
        // completed this form
        acceptsEmailMarketing: checkout.shippingAddress
          ? acceptsEmailMarketing
          : true,
        countryCode: locale.countryCode,
        email,
      }),
    []
  );

  const lazyCheckoutUpdate = useConditionalUpdate(
    (variables: CheckoutUpdateInput) => checkoutUpdate({ variables }),
    (input, values) => !isEqual(input.email, values?.email),
    {
      email: { email: email ?? undefined },
    }
  );

  if (customerLoading) {
    return null;
  }

  const handleChange: FormSpyProps<CheckoutStepInformationForm>["onChange"] = ({
    active,
    errors,
    touched,
    values,
  }) => {
    if (active !== "email" && values.email && !errors.email) {
      const { acceptsEmailMarketing, email } = values;

      lazyCheckoutUpdate({
        email: {
          acceptsEmailMarketing: touched?.acceptsEmailMarketing
            ? acceptsEmailMarketing
            : undefined,
          email,
        },
      });
    }

    // Mark the second step as "viewed" as soon as the user touches any of the
    // address fields
    if (
      !hasStartedShippingRef.current &&
      active &&
      [
        "address1",
        "address2",
        "city",
        "company",
        "countryCode",
        "firstName",
        "lastName",
        "phone",
        "province",
        "zip",
      ].includes(active)
    ) {
      trackAddShippingInfoEvent(checkout);
      hasStartedShippingRef.current = true;
    }
  };

  const handleSubmit = async ({
    acceptsEmailMarketing,
    acceptsSMSMarketing,
    address1,
    address2,
    city,
    company,
    countryCode,
    email,
    firstName,
    lastName,
    phone,
    province,
    zip,
  }: AnyObject) => {
    try {
      let input: CheckoutUpdateInput = {
        shippingAddress: {
          address: {
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
          },
        },
      };

      if (!customer) {
        input = { ...input, email: { acceptsEmailMarketing, email } };
      }

      const [{ data }, smsResult] = await Promise.all([
        checkoutUpdate({ variables: input }),
        phone && acceptsSMSMarketing
          ? subscribeToSMS({
              variables: { email, phone, source: "Checkout" },
            })
          : Promise.resolve(null),
      ]);

      if (!data) {
        throw new Error("Invalid response: missing data");
      }

      const { rCheckout, userErrors: checkoutErrors } = data.payload;
      const smsErrors = smsResult?.data?.payload.userErrors ?? [];

      if (smsErrors.length > 0) {
        captureDetailedException(
          new Error("masked phone input failed Attentive validation"),
          {
            userErrors: smsErrors,
          }
        );
      }

      if (checkoutErrors.length > 0) {
        const errorMapper = getUserErrorsMapper({
          email: {
            acceptsEmailMarketing: "acceptsEmailMarketing",
            email: "email",
          },
          shippingAddress: {
            address: {
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
          },
        });

        return errorMapper(checkoutErrors);
      }

      if (acceptsEmailMarketing) {
        dataLayerTrack({
          email,
          event: "dl_subscribe",
          source: "Checkout",
        });
      }

      if (phone && acceptsSMSMarketing) {
        dataLayerTrack({
          email,
          event: "dl_subscribe_sms",
          phone,
          source: "Checkout",
        });
      }

      const nextStep = CheckoutStep.PAYMENT;

      if (!rCheckout || !isCheckoutStepReady(rCheckout, nextStep)) {
        // We shouldn't hit this unless something goes wrong on the backend,
        // but we want to avoid the user being redirected back to this step
        // without any warning
        const error: ExtendedError = new Error(
          "Invalid response: invalid checkout state"
        );
        error.checkout = rCheckout;
        error.input = input;

        throw error;
      }

      router.push({ pathname: "/checkout/[step]", query: { step: nextStep } });
    } catch (error) {
      captureException(error);

      toast.push({
        children: t("checkoutStepInformation:error"),
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <Form _css={s(_css)} initialValues={initialValues} onSubmit={handleSubmit}>
      {({ busy: busyForm }) => {
        const busy = busyPaymentRequest || busyForm || hasCompletedCheckout;

        return (
          <>
            <FormSpy
              subscription={{
                active: true,
                errors: true,
                touched: true,
                values: true,
              }}
              onChange={handleChange}
            />
            <fieldset>
              <div
                css={s({
                  alignItems: "baseline",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                })}
              >
                <legend
                  css={s(headingDelta, (t) => ({
                    display: "block",
                    marginRight: t.spacing.md,
                  }))}
                >
                  {t("checkoutStepInformation:contact.title")}
                </legend>
              </div>
              {customer ? (
                <div
                  css={s((t) => ({
                    flexShrink: 0,
                    marginTop: t.spacing.sm,
                    width: "100%",
                  }))}
                >
                  {t("checkoutStepInformation:contact.strapline.auth")}{" "}
                  <span
                    css={s((t) => ({
                      fontWeight: t.font.primary.weight.medium,
                    }))}
                  >
                    {customer.email}
                  </span>
                </div>
              ) : (
                <>
                  <Field
                    _css={s((t) => ({ marginTop: t.spacing.sm }))}
                    busy={busy}
                    name="email"
                    label={t(
                      "checkoutStepInformation:contact.field.email.label"
                    )}
                    type="email"
                    validate={validateEmail(
                      t("checkoutStepInformation:contact.field.email.error")
                    )}
                  />
                  <CheckboxField
                    _css={s((t) => ({
                      backgroundColor: t.color.tint.moss,
                      marginTop: t.spacing.sm,
                      padding: [t.spacing.sm, null, t.spacing.md],
                    }))}
                    label={t(
                      "checkoutStepInformation:contact.field.acceptsEmailMarketing.label"
                    )}
                    name="acceptsEmailMarketing"
                  />
                </>
              )}
            </fieldset>

            {paymentRequest && (
              <>
                <Divider
                  _css={s((t) => ({
                    marginTop: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  {t("checkoutStepInformation:express.title")}
                </Divider>
                <ExpressCheckout
                  _css={s((t) => ({
                    marginTop: t.spacing.md,
                  }))}
                  busy={busyPaymentRequest}
                  disabled={busy}
                  paymentRequest={paymentRequest}
                />
                <Divider _css={s((t) => ({ marginTop: t.spacing.md }))}>
                  {t("checkoutStepInformation:express.alternative")}
                </Divider>
              </>
            )}

            <fieldset
              css={s((t) => ({
                marginTop: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              <legend css={s(headingDelta, { display: "block" })}>
                {t("checkoutStepInformation:shipping.title")}
              </legend>
              <AddressFields
                _css={s((t) => ({
                  marginTop: t.spacing.sm,
                }))}
                busy={busy}
                countries={
                  ECOMMERCE.shippingCountries?.[locale.langtag]?.reduce(
                    (accum, countryCode) => ({
                      ...accum,
                      [countryCode]: Countries[countryCode],
                    }),
                    {}
                  ) ?? Countries
                }
                section="shipping"
              />
            </fieldset>
            <fieldset
              css={s((t) => ({
                marginBottom: [t.spacing.lg],
              }))}
            >
              <legend css={s(visuallyHidden)}>SMS Marketing</legend>
              <CheckboxField
                _css={s((t) => ({
                  backgroundColor: t.color.tint.moss,
                  marginTop: t.spacing.sm,
                  padding: [t.spacing.sm, null, t.spacing.md],
                }))}
                label={
                  <>
                    <p>
                      <Trans i18nKey="checkoutStepInformation:contact.field.acceptsSMSMarketing.label" />
                    </p>
                    <p
                      css={s((t) => ({
                        fontSize: 10,
                        lineHeight: 1.3,
                        paddingTop: t.spacing.xxs,
                      }))}
                    >
                      <Trans
                        i18nKey="checkoutStepInformation:contact.field.acceptsSMSMarketing.disclaimer"
                        components={{
                          PrivacyLink: (
                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                            <a
                              css={s(link)}
                              href="http://attn.tv/fotp/terms.html"
                              rel="noopener noreferrer"
                              target="_blank"
                            />
                          ),
                          TermsLink: (
                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                            <a
                              css={s(link)}
                              href="https://attnl.tv/p/3Np"
                              rel="noopener noreferrer"
                              target="_blank"
                            />
                          ),
                        }}
                      />
                    </p>
                  </>
                }
                name="acceptsSMSMarketing"
              />
            </fieldset>
            <Grid
              direction="rtl"
              innerCss={s({ alignItems: "center" })}
              itemWidth={[percentage(1), null, null, percentage(1 / 2)]}
              gx={theme.spacing.md}
              gy={theme.spacing.lg}
            >
              <Item>
                <button
                  css={s(primaryButton({ disabled: busy }), (t) => ({
                    position: "relative",
                    ...px(t.spacing.sm),
                    width: "100%",
                  }))}
                  data-testid="checkout-information-continue-button"
                  disabled={busy}
                >
                  <span
                    css={s({
                      display: "block",
                      opacity: busyForm ? 0.5 : 1,
                      transition: "opacity 500ms",
                    })}
                  >
                    {t("checkoutStepInformation:next")}
                  </span>
                  <Spinner
                    _css={s({
                      opacity: busyForm ? 1 : 0,
                      transition: "opacity 500ms",
                    })}
                  />
                </button>
              </Item>
              <Item _css={s({ textAlign: ["center", null, null, "inherit"] })}>
                <Link css={s(headingEchoStatic, linkReverse)} to="/cart">
                  <Icon
                    _css={s((t) => ({
                      ...size(8),
                      marginRight: t.spacing.xs,
                      verticalAlign: "baseline",
                    }))}
                    path={chevronLeft}
                  />
                  {t("checkoutStepInformation:previous")}
                </Link>
              </Item>
            </Grid>
          </>
        );
      }}
    </Form>
  );
};

export default CheckoutStepInformation;
