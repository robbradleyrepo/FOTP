import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { secondaryButton } from "../../base/button";
import { bodyText } from "../../base/typography";
import button from "./button";
import { useCartOfferLayout } from "./layout";

const enUsResource = {
  add: "Add to {{ type }}",
  cancel: {
    CART: "Go to cart",
    CHECKOUT: "No thanks",
  },
};

interface CartOfferFooterProps extends ComponentStyleProps {
  title: string;
}

export const CartOfferFooter: FC<CartOfferFooterProps> = ({
  _css = {},
  title,
}) => {
  const {
    destination,
    isBusy,
    selection: {
      frequency,
      variant: {
        computed: { prices },
      },
    },
    styles,
    type,
  } = useCartOfferLayout();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartOfferFooter", enUsResource);

  return (
    <div
      css={s(
        styles.belt,
        {
          alignItems: "center",
          display: [null, null, null, "flex"],
          justifyContent: "space-between",
        },
        _css
      )}
    >
      <p css={s(bodyText)}>
        {title}{" "}
        <span css={s((t) => ({ fontWeight: t.font.primary.weight.medium }))}>
          {formatCurrency(prices.currentPrice)}
        </span>{" "}
        {prices.currentPrice.amount !== prices.regularPrice.amount && (
          <span
            css={s({
              opacity: 0.7,
              textDecoration: "line-through",
            })}
          >
            {formatCurrency(prices.regularPrice)}
          </span>
        )}
      </p>
      <div
        css={s((t) => ({
          display: "flex",
          marginTop: [t.spacing.xs, null, null, 0],
          minWidth: [null, null, null, 360],
        }))}
      >
        <button
          css={s(
            button({ disabled: isBusy, type }),
            styles.buttonSmall,
            (t) => ({ marginRight: t.spacing.xxs })
          )}
          disabled={isBusy}
          type="submit"
        >
          {t("cartOfferFooter:add", {
            type: t(
              `cartOfferLayout:orderType.${frequency ? "subscription" : "otp"}`
            ),
          })}
        </button>
        <Link
          css={s(secondaryButton(), styles.buttonSmall, (t) => ({
            fontSize: [12, null, 14],
            marginLeft: t.spacing.xxs,
          }))}
          replace
          to={destination.path}
        >
          {t(`cartOfferFooter:cancel.${destination.type}`)}
        </Link>
      </div>
    </div>
  );
};

export default CartOfferFooter;
