import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, px, s, visuallyHidden } from "@/common/ui/utils";

import { secondaryButton } from "../../base/button";
import {
  bodyTextStatic,
  headingCharlieStatic,
  headingDeltaStatic,
} from "../../base/typography";
import button from "./button";
import { useCartOfferLayout } from "./layout";

const enUsResource = {
  add: "Add to my {{ type }} - {{ amount }}",
  cancel: {
    CART: "No thanks, continue to cart",
    CHECKOUT: "No thanks, continue to checkout",
  },
  price: {
    current: "Your price",
    rrp: "RRP",
    save: "You save {{ amount }}",
  },
};

export const CartOfferCta: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const {
    destination,
    isBusy,
    selection: {
      frequency,
      variant: {
        computed: { prices },
      },
    },
    type,
  } = useCartOfferLayout();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartOfferCta", enUsResource);

  return (
    <div css={s(_css)}>
      {prices.currentPrice.amount !== prices.regularPrice.amount && (
        <p
          css={s(bodyTextStatic, {
            opacity: 0.7,
            textDecoration: "line-through",
          })}
        >
          <span css={s(visuallyHidden)}>{t("cartOfferCta:price.rrp")}: </span>
          {formatCurrency(prices.regularPrice)}
        </p>
      )}
      <div
        css={s({
          alignItems: "baseline",
          display: "flex",
          justifyContent: "space-between",
        })}
      >
        <p css={s(headingCharlieStatic)}>
          <span css={s(visuallyHidden)}>
            {t("cartOfferCta:price.current")}:{" "}
          </span>
          {formatCurrency(prices.currentPrice)}
        </p>
        {prices.currentDiscount && (
          <p
            css={s(headingDeltaStatic, (t) => ({
              color: t.color.accent.light,
            }))}
          >
            {t("cartOfferCta:price.save", {
              amount: formatCurrency(prices.currentDiscount.price),
            })}
          </p>
        )}
      </div>

      <button
        css={s(button({ disabled: isBusy, type }), (t) => ({
          marginTop: t.spacing.lg,
          width: "100%",
          ...px(t.spacing.xs),
        }))}
        disabled={isBusy}
        type="submit"
      >
        {t("cartOfferCta:add", {
          amount: formatCurrency(prices.currentPrice),
          type: t(
            `cartOfferLayout:orderType.${frequency ? "subscription" : "otp"}`
          ),
        })}
      </button>
      <Link
        css={s(secondaryButton(), (t) => ({
          fontSize: [12, null, 14],
          marginTop: t.spacing.sm,
          ...px(t.spacing.xs),
          width: "100%",
        }))}
        replace
        to={destination.path}
      >
        {t(`cartOfferCta:cancel.${destination.type}`)}
      </Link>
    </div>
  );
};

export default CartOfferCta;
