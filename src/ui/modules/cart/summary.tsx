import { CartData } from "@sss/ecommerce/cart";
import { moneyFns } from "@sss/ecommerce/common";
import { useInView } from "@sss/hooks";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";

import { s, StyleFn } from "@/common/ui/utils";

import { primaryButton, secondaryButton } from "../../base/button";
import Discount from "../../base/discount";
import Progress from "../../base/progress";
import { bodyTextSmallStatic, bodyTextStatic } from "../../base/typography";
import { ShoppingGivesCart } from "../shopping-gives";

const enUsResource = {
  continueShopping: "Continue shopping",
  cta: "Checkout",
  discount: {
    label: "Discount",
    value: "Applied at checkout",
  },
  info: "90 day money-back guarantee",
  savings: {
    label: "Savings",
  },
  shipping: {
    free: {
      label: "Shipping",
      value: "Free",
    },
    paid: {
      label: "Free shipping on orders over {{ amount }}",
    },
  },
  subtotal: {
    label: "Subtotal",
  },
};

const variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
};

const dtStyle: StyleFn = (t) => ({
  marginBottom: t.spacing.xxs,
  width: "50%",
});
const ddStyle = s(dtStyle, {
  textAlign: "right",
});

const dlDivStyle = {
  display: "flex",
  flexWrap: "wrap",
};

interface CartSummaryProps
  extends Pick<
    CartData,
    | "discountCode"
    | "lineItemsSavingsPrice"
    | "lineItemsSubtotalPrice"
    | "shippingThreshold"
  > {
  continueShopping?: boolean;
  onCheckoutClick: () => void;
  shoppingGivesWidget?: boolean;
  stickyCta?: boolean;
}

const CartSummary: FC<CartSummaryProps> = ({
  continueShopping,
  discountCode,
  onCheckoutClick,
  lineItemsSavingsPrice,
  lineItemsSubtotalPrice,
  shippingThreshold,
  shoppingGivesWidget,
  stickyCta,
}) => {
  const formatCurrency = useCurrencyFormatter();
  const [ref, inView] = useInView();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartSummary", enUsResource);

  const freeShippingProgress = shippingThreshold
    ? moneyFns.toFloat(lineItemsSubtotalPrice) /
      moneyFns.toFloat(shippingThreshold)
    : null;
  const hasFreeShipping = !freeShippingProgress || freeShippingProgress >= 1;

  return (
    <>
      {shoppingGivesWidget && (
        <ShoppingGivesCart
          _css={s((t) => ({
            marginBottom: t.spacing.md,
          }))}
        />
      )}
      <AnimatePresence initial={false}>
        {freeShippingProgress && !hasFreeShipping && (
          <motion.div
            css={s({ width: "100%" })}
            animate={variants.visible}
            exit={variants.hidden}
            initial={variants.hidden}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p
              css={s(bodyTextSmallStatic, (t) => ({
                marginBottom: t.spacing.xs,
                textAlign: "center",
              }))}
            >
              {t("cartSummary:shipping.paid.label", {
                amount:
                  shippingThreshold &&
                  formatCurrency({
                    ...shippingThreshold,
                    fractionDigits: 0,
                  }),
              })}
            </p>
            <Progress
              _css={s((t) => ({ marginBottom: t.spacing.sm }))}
              progress={freeShippingProgress}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <dl
        css={s(bodyTextSmallStatic, (t) => ({
          marginBottom: t.spacing.md,
        }))}
      >
        <AnimatePresence initial={false}>
          {discountCode && (
            <motion.div
              css={s(dlDivStyle)}
              animate={variants.visible}
              exit={variants.hidden}
              initial={variants.hidden}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <dt css={s(dtStyle)}>
                <span
                  css={s((t) => ({
                    marginRight: t.spacing.sm,
                  }))}
                >
                  {t("cartSummary:discount.label")}
                </span>
                <Discount>{discountCode}</Discount>
              </dt>
              <dd css={s(ddStyle)}>{t("cartSummary:discount.value")}</dd>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {hasFreeShipping && (
            <motion.div
              css={s(dlDivStyle)}
              animate={variants.visible}
              exit={variants.hidden}
              initial={variants.hidden}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <dt css={s(dtStyle)}>{t("cartSummary:shipping.free.label")}</dt>
              <dd css={s(ddStyle)}>{t("cartSummary:shipping.free.value")}</dd>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {lineItemsSavingsPrice &&
            moneyFns.toFloat(lineItemsSavingsPrice) > 0 && (
              <motion.div
                css={s(dlDivStyle)}
                animate={variants.visible}
                exit={variants.hidden}
                initial={variants.hidden}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <dt css={s(dtStyle)}>{t("cartSummary:savings.label")}</dt>
                <dd css={s(ddStyle)}>
                  {formatCurrency(moneyFns.multiply(lineItemsSavingsPrice, -1))}
                </dd>
              </motion.div>
            )}
        </AnimatePresence>
        <div
          css={s(bodyTextStatic, dlDivStyle, (t) => ({
            fontWeight: t.font.primary.weight.book,
            marginTop: t.spacing.xs,
          }))}
        >
          <dt css={s(dtStyle, { marginBottom: 0 })}>
            {t("cartSummary:subtotal.label")}
          </dt>
          <dd css={s(ddStyle, { marginBottom: 0 })}>
            {formatCurrency(lineItemsSubtotalPrice)}
          </dd>
        </div>
      </dl>
      <button
        css={s(primaryButton(), (t) => ({
          ...(stickyCta && {
            bottom: t.spacing.lg,
            // Working out if an element with `position: sticky` is stuck or
            // not is hard. Instead of querying the sticky button itself, we'll
            // just add a placeholder element that become visible when the
            // button is unstuck
            boxShadow: inView ? null : "0 2px 16px 0 rgba(0, 0, 0, 0.2)",
            position: "sticky",
          }),
          maxWidth: "unset",
          width: "100%",
        }))}
        onClick={onCheckoutClick}
        data-testid="cart-summary-cta"
      >
        {t("cartSummary:cta")}
      </button>
      <div
        css={s((t) => ({ position: "relative", top: t.spacing.lg }))}
        ref={ref}
      />
      {continueShopping && (
        <Link
          css={s(secondaryButton(), (t) => ({
            marginTop: t.spacing.sm,
            maxWidth: "unset",
            width: "100%",
          }))}
          to="/products"
        >
          {t("cartSummary:continueShopping")}
        </Link>
      )}
      <p
        css={s(bodyTextSmallStatic, (t) => ({
          marginBottom: t.spacing.sm,
          marginTop: t.spacing.md,
          textAlign: "center",
        }))}
      >
        {t("cartSummary:info", {
          amount:
            shippingThreshold &&
            formatCurrency({ ...shippingThreshold, fractionDigits: 0 }),
        })}
      </p>
    </>
  );
};

export default CartSummary;
