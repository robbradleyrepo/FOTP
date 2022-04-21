import { useMutation } from "@apollo/react-hooks";
import { useCart } from "@sss/ecommerce/cart";
import { Checkout, CHECKOUT_UPDATE } from "@sss/ecommerce/checkout";
import { FieldErrors, getUserErrorsMapper, validateRequired } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { AnyObject } from "final-form";
import React, { FC, useEffect, useState } from "react";
import { Field, useForm } from "react-final-form";

import {
  ComponentStyleProps,
  link,
  py,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import { primaryButton } from "../../base/button";
import Discount from "../../base/discount";
import Spinner from "../../base/spinner";
import { ToastType, useToastController } from "../../base/toast";
import {
  bodyTextSmallStatic,
  bodyTextStatic,
  callToActionTextStatic,
  headingEchoStatic,
} from "../../base/typography";
import Form from "../../forms/form";
import { input as inputStyle } from "../../forms/input";

const enUsResource = {
  add: "Apply",
  error: {
    code: {
      EXISTING_CUSTOMER: "Discount code can only be used by new customers",
      EXPIRED: "Discount code has expired",
      INVALID: "Discount code is invalid",
      NOT_APPLICABLE: "Discount does not apply to items currently in your cart",
      ONCE_PER_EMAIL: "Discount code can only be used once per customer",
      REQUIRES_EMAIL: "You must provide your email to use this discount",
      SPEND_THRESHOLD_MAX:
        "You have exceeded the maximum order value for this discount",
      SPEND_THRESHOLD_MIN:
        "You have not met the minimum order value for this discount",
    },
    input: "Please enter a valid discount code",
    unknown: "Something went wrong applying your discount. Please try again.",
  },
  label: "Discount code",
  remove: "Remove",
  success: "Discount successfully applied",
};

const DiscountSync: FC<{ discountCode: string | null }> = ({
  discountCode,
}) => {
  const form = useForm();
  const [hasSynced, setHasSynced] = useState(false);
  const toast = useToastController();

  useEffect(() => {
    if (hasSynced || !discountCode) {
      return;
    }

    (async () => {
      setHasSynced(true);

      const errors = await form.submit();

      if (errors?.code) {
        errors.code.forEach((error: string) =>
          toast.push({
            children: error,
            type: ToastType.ERROR,
          })
        );
      }
    })();
  }, [discountCode, form, hasSynced, setHasSynced, toast]);

  return null;
};

type CheckoutDiscountProps = Pick<Checkout, "discount"> & ComponentStyleProps;

const CheckoutDiscount: FC<CheckoutDiscountProps> = ({
  _css = {},
  discount,
}) => {
  const { discountCode, setDiscountCode } = useCart();
  const { i18n, t } = useLocale();
  const [checkoutUpdate] = useMutation(CHECKOUT_UPDATE);
  const [isBusy, setIsBusy] = useState(false);
  const toast = useToastController();

  i18n.addResourceBundle("en-US", "checkoutDiscount", enUsResource);

  const handleRemove = async () => {
    setIsBusy(true);

    try {
      const {
        data: {
          payload: { userErrors },
        },
      } = await checkoutUpdate({ variables: { discount: { code: null } } });

      if (userErrors.length > 0) {
        throw new Error("Unexpected error removing discount code");
      }

      setDiscountCode(null);
    } catch (error) {
      toast.push({
        children: t("checkoutDiscount:error.unknown"),
        type: ToastType.ERROR,
      });
    }

    setIsBusy(false);
  };

  const handleSubmit = async ({ code }: AnyObject) => {
    try {
      const {
        data: {
          payload: { userErrors },
        },
      } = await checkoutUpdate({
        variables: {
          discount: { code },
        },
      });

      if (userErrors.length > 0) {
        const errorMapper = getUserErrorsMapper({
          discount: { code: "code" },
        });

        return errorMapper(userErrors);
      }

      setDiscountCode(code);
    } catch (error) {
      return {
        code: [t("checkoutDiscount:error.unknown")],
      };
    }
  };

  return (
    <Form
      _css={s(
        (t) => ({
          ...py(t.spacing.md),
          borderBottomColor: t.color.border.light,
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          display: "flex",
        }),
        _css
      )}
      busyAfterSubmit={false}
      initialValues={{ code: discountCode }}
      label={t("checkoutDiscount:label")}
      onSubmit={handleSubmit}
    >
      {({ busy }) => (
        <>
          <DiscountSync discountCode={discountCode} />
          {discount && discount.code === discountCode ? (
            <dl css={s(bodyTextSmallStatic, { width: "100%" })}>
              <dt>{t("checkoutDiscount:label")}</dt>
              <dd
                css={s((t) => ({
                  marginTop: t.spacing.xs,
                  paddingLeft: t.spacing.md,
                  position: "relative",
                }))}
              >
                <Spinner
                  _css={s((t) => ({
                    ...size(t.spacing.md),
                    opacity: isBusy ? 1 : 0,
                    transition: "opacity 500ms",
                  }))}
                />
                <span
                  css={s({
                    display: "block",
                    opacity: isBusy ? 0.5 : 1,
                    transition: "opacity 500ms",
                  })}
                >
                  <Discount
                    _css={s({
                      "&:before": { left: 0, position: "absolute", top: 4 },
                    })}
                  >
                    {discount.code}
                  </Discount>
                  <span
                    css={s((t) => ({
                      color: discount.applicable
                        ? t.color.state.success
                        : t.color.state.error,
                      display: "block",
                      marginTop: t.spacing.xxs,
                    }))}
                  >
                    {discount.applicable
                      ? t("checkoutDiscount:success")
                      : t(
                          `checkoutDiscount:error.code.${
                            // ReCharge returns a general invalid error if an
                            // existing customer attempts to apply a referral
                            // discount
                            discount.code.startsWith("FRIEND-") &&
                            discount.reason === "INVALID"
                              ? "EXISTING_CUSTOMER"
                              : discount.reason
                          }`
                        )}
                  </span>
                  <button
                    css={s(headingEchoStatic, link, {
                      position: "absolute",
                      right: 0,
                      top: 0,
                    })}
                    onClick={handleRemove}
                    type="reset"
                  >
                    {t("checkoutDiscount:remove")}
                  </button>
                </span>
              </dd>
            </dl>
          ) : (
            <>
              <Field
                name="code"
                validate={validateRequired(t("checkoutDiscount:error.input"))}
              >
                {({
                  input,
                  meta: {
                    active,
                    dirtySinceLastSubmit,
                    error = [],
                    pristine,
                    submitError = [],
                    submitFailed,
                  },
                }) => {
                  let visibleErrors: FieldErrors = [];

                  // Show client-side errors after a failed submission or once the user
                  // has changed the field
                  if (submitFailed || (!pristine && !active)) {
                    visibleErrors = [...visibleErrors, ...error];
                  }

                  // Show server-side errors if the value has not changes since the last
                  // submission
                  if (!dirtySinceLastSubmit) {
                    visibleErrors = [...visibleErrors, ...submitError];
                  }

                  const shouldShowError = !!visibleErrors.length;

                  return (
                    <label css={s({ flexGrow: 1 })}>
                      <span css={s(visuallyHidden)}>
                        {t("checkoutDiscount:label")}
                      </span>
                      <input
                        css={s(
                          bodyTextStatic,
                          inputStyle({ disabled: busy, ...input }),
                          { height: 46 }
                        )}
                        disabled={busy}
                        placeholder={t("checkoutDiscount:label")} // TODO: use dynamically positioned label instead of `placeholder`
                        {
                          ...(input as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                        }
                      />
                      {shouldShowError && (
                        <ul>
                          {visibleErrors.map((message, index) => (
                            <li
                              css={s(bodyTextSmallStatic, (t) => ({
                                color: t.color.state.error,
                                display: "inline-block",
                                marginTop: t.spacing.xs,
                              }))}
                              key={index}
                            >
                              {message}
                            </li>
                          ))}
                        </ul>
                      )}
                    </label>
                  );
                }}
              </Field>
              <button
                css={s(primaryButton(), callToActionTextStatic, (t) => ({
                  flexShrink: 0,
                  height: 46,
                  marginLeft: t.spacing.sm,
                  padding: 0,
                  position: "relative",
                  width: 80,
                }))}
                type="submit"
              >
                <span
                  css={s({
                    opacity: busy ? 0 : 1,
                    tranisition: "opacity 500ms",
                  })}
                >
                  {t("checkoutDiscount:add")}
                </span>
                <Spinner
                  _css={s((t) => ({
                    ...size(t.spacing.md),
                    opacity: busy ? 1 : 0,
                    transition: "opacity 500ms",
                  }))}
                />
              </button>
            </>
          )}
        </>
      )}
    </Form>
  );
};

export default CheckoutDiscount;
