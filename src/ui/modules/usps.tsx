import { useCart } from "@sss/ecommerce/cart";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import React, { FC, ReactNode } from "react";
import { RequireAtLeastOne } from "type-fest";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import Icon from "../base/icon";
import box from "../icons/box";
import medal from "../icons/medal";
import usFlag from "../icons/usFlag";
import vetRecommended from "../icons/vetRecommended";

const enUsResource = {
  guarantee: "90 day money-back guarantee",
  shipping: "FREE shipping on all orders over {{ amount }}",
  usa: "Made in and ships from USA facilities",
  vet: "Vet recommended",
};

enum USP {
  GUARANTEE = "guarantee",
  SHIPPING = "shipping",
  USA = "usa",
  VET = "vet",
}

type USPsProps = ComponentStyleProps &
  RequireAtLeastOne<Record<USP, ReactNode | boolean>> & {
    iconCss?: ComponentStyleProps["_css"];
    itemCss?: ComponentStyleProps["_css"];
  };

const USPs: FC<USPsProps> = ({
  _css = {},
  iconCss = {},
  itemCss = {},
  ...rest
}) => {
  const { shippingThreshold } = useCart();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "USPs", enUsResource);

  return (
    <ul
      css={s(
        (t) => ({
          fontWeight: t.font.primary.weight.medium,
          textAlign: "left",
        }),
        _css
      )}
    >
      {[
        {
          data: {
            amount:
              shippingThreshold &&
              formatCurrency({
                ...shippingThreshold,
                fractionDigits: 0,
              }),
          },
          key: USP.SHIPPING,
          path: box,
        },
        { key: USP.GUARANTEE, path: medal },
        { key: USP.VET, path: vetRecommended },
        { key: USP.USA, path: usFlag },
      ].map(
        ({ data, key, path }) =>
          !!rest[key] && (
            <li
              key={key}
              css={s(
                (t) => ({
                  "&:first-child": {
                    marginTop: 0,
                  },
                  fontSize: [12, null, "inherit"],
                  marginTop: t.spacing.sm,
                  whiteSpace: "nowrap",
                }),
                itemCss
              )}
            >
              <Icon
                _css={s(
                  (t) => ({
                    height: 24,
                    marginRight: t.spacing.sm,
                    verticalAlign: "top",
                    width: 24,
                  }),
                  iconCss
                )}
                path={path}
              />
              {rest[key] !== true ? rest[key] : t(`USPs:${key}`, data)}
            </li>
          )
      )}
    </ul>
  );
};

export default USPs;
