import { Checkout } from "@sss/ecommerce/checkout";
import { Money, moneyFns } from "@sss/ecommerce/common";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { ComponentStyleProps, s, StyleFn } from "@/common/ui/utils";

import Discount from "../../base/discount";
import {
  bodyTextSmallStatic,
  bodyTextStatic,
  headingDeltaStatic,
} from "../../base/typography";
import { ShoppingGivesCart } from "../shopping-gives";

const enUsResource = {
  discount: {
    label: "Discount",
  },
  shipping: {
    label: "Shipping",
    value: {
      fallback: "Calculated at next step",
      free: "Free",
    },
  },
  subtotal: {
    label: "Subtotal",
  },
  taxes: {
    label: "Taxes",
    value: { fallback: "Calculated at next step" },
  },
  total: {
    info: "Not including taxes",
    label: "Total",
  },
};

const dlPairStyle: StyleFn = (t) => ({
  alignItems: "flex-end",
  display: "flex",
  justifyContent: "space-between",
  marginTop: t.spacing.xs,
  width: "100%",
});

type CheckoutSummaryProps = Pick<
  Checkout,
  | "discount"
  | "lineItemsSubtotalPrice"
  | "shippingRate"
  | "taxLines"
  | "totalPrice"
  | "totalShipping"
  | "totalTax"
> &
  ComponentStyleProps & {
    interactive: boolean;
    shippingThreshold: Money | null;
  };

const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  _css = {},
  discount,
  interactive,
  lineItemsSubtotalPrice,
  shippingRate,
  shippingThreshold,
  taxLines,
  totalPrice,
  totalTax,
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutSummary", enUsResource);

  const exShippingSubtotal = discount
    ? moneyFns.subtract(lineItemsSubtotalPrice, discount.amount)
    : lineItemsSubtotalPrice;

  const hasFreeShipping =
    (!!shippingRate && moneyFns.toFloat(shippingRate.price) === 0) ||
    (!!shippingThreshold &&
      moneyFns.toFloat(exShippingSubtotal) >=
        moneyFns.toFloat(shippingThreshold));

  const shippingValue = hasFreeShipping
    ? t("checkoutSummary:shipping.value.free")
    : shippingRate
    ? formatCurrency(shippingRate.price)
    : t("checkoutSummary:shipping.value.fallback");

  return (
    <div css={s(_css)}>
      {interactive && (
        <ShoppingGivesCart
          _css={s((t) => ({ marginTop: t.spacing.md }))}
          targetId="shopping-gives-cart-widget-checkout"
        />
      )}
      <dl
        css={s(bodyTextSmallStatic, (t) => ({
          display: "flex",
          flexWrap: "wrap",
          marginTop: t.spacing.md,
        }))}
      >
        <div css={s(dlPairStyle, { marginTop: 0 })}>
          <dt>{t("checkoutSummary:subtotal.label")}</dt>
          <dd>{formatCurrency(lineItemsSubtotalPrice)}</dd>
        </div>
        {discount?.applicable && (
          <div css={s(dlPairStyle)}>
            <dt>
              <span css={s((t) => ({ marginRight: t.spacing.sm }))}>
                {t("checkoutSummary:discount.label")}
              </span>
              {discount?.code && <Discount>{discount.code}</Discount>}
            </dt>
            <dd>{formatCurrency(moneyFns.multiply(discount.amount, -1))}</dd>
          </div>
        )}
        <div css={s(dlPairStyle)}>
          <dt>{t("checkoutSummary:shipping.label")}</dt>
          <dd>{shippingValue}</dd>
        </div>
        <div css={s(dlPairStyle)}>
          <dt>{t("checkoutSummary:taxes.label")}</dt>
          <dd>
            {taxLines
              ? formatCurrency(totalTax)
              : t("checkoutSummary:taxes.value.fallback")}
          </dd>
        </div>
        <div
          css={s(dlPairStyle, (t) => ({
            borderTopColor: t.color.border.light,
            borderTopStyle: "solid",
            borderTopWidth: 1,
            marginTop: t.spacing.md,
            paddingTop: t.spacing.sm,
          }))}
        >
          <dt>
            <span css={s(bodyTextStatic, { display: "block" })}>
              {t("checkoutSummary:total.label")}
            </span>
            {!taxLines && (
              <span css={s({ opacity: 0.7 })}>
                {t("checkoutSummary:total.info")}
              </span>
            )}
          </dt>
          <dd>
            <span css={s(headingDeltaStatic)}>
              {formatCurrency(totalPrice)}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default CheckoutSummary;
