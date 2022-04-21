import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { rgba } from "polished";
import React, { FC, ReactNode } from "react";

import { ComponentStyleProps, s, visuallyHidden } from "@/common/ui/utils";

import ResponsiveImage from "../../base/responsive-image";
import {
  bodyTextSmallStatic,
  headingDeltaStatic,
  headingEchoStatic,
} from "../../base/typography";
import RadioField from "../../forms/radio-field";
import { useCartOfferLayout } from "./layout";

const enUsResource = {
  variant: {
    price: {
      current: "Your price",
      rrp: "RRP",
      save: "Save {{ percentage }}%",
    },
  },
};

const labelStyle = s(headingEchoStatic, {
  fontSize: 16,
});

const legendStyle = s(headingDeltaStatic, (t) => ({
  marginBottom: t.spacing.md,
}));

const radioFieldStyle = (selected: boolean) =>
  s((t) => ({
    "&:first-child": {
      borderTopLeftRadius: t.radius.sm,
      borderTopRightRadius: t.radius.sm,
      borderTopWidth: 1,
    },
    "&:last-child": {
      borderBottomLeftRadius: t.radius.sm,
      borderBottomRightRadius: t.radius.sm,
      borderBottomWidth: 1,
    },
    backgroundColor: selected ? t.color.background.feature1 : null,
    borderColor: t.color.border.light,
    borderWidth: 0, // eslint-disable-next-line sort-keys
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderStyle: "solid",
    color: selected
      ? t.color.text.dark.base
      : rgba(t.color.text.dark.base, 0.6),
    padding: t.spacing.sm,
    transition: "background-color 300ms, color 500ms",
  }));

interface CartOfferPickerProps extends ComponentStyleProps {
  labels: Record<"product" | "variant", ReactNode>;
}

const CartOfferPicker: FC<CartOfferPickerProps> = ({ _css = {}, labels }) => {
  const { products, isBusy, selection } = useCartOfferLayout();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "CartOfferPicker", enUsResource);

  return (
    <div css={s(_css)}>
      <fieldset css={s((t) => ({ marginBottom: t.spacing.lg }))}>
        <legend css={s(legendStyle)}>{labels.product}</legend>
        <div>
          {products.map((product) => {
            const selected = selection.product.handle === product.handle;

            return (
              <RadioField
                key={product.id}
                _css={s(radioFieldStyle(selected))}
                align="center"
                busy={isBusy}
                label={<span css={s(labelStyle)}>{product.title}</span>}
                name="handle"
                value={product.handle}
              />
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend css={s(legendStyle)}>{labels.variant}</legend>
        <div>
          {selection.product.variants.edges.map(({ node: variant }) => {
            const selected = selection.variant.sku === variant.sku;

            return (
              <RadioField
                key={variant.id}
                _css={s(radioFieldStyle(selected))}
                align="center"
                busy={isBusy}
                label={
                  <div
                    css={s({
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "stretch",
                      width: "100%",
                    })}
                  >
                    <div
                      css={s((t) => ({
                        flexGrow: 0,
                        flexShrink: 0,
                        marginRight: t.spacing.sm,
                        width: 64,
                      }))}
                    >
                      <ResponsiveImage
                        alt=""
                        height={variant.image.height ?? 2048}
                        sizes={{ width: 64 }}
                        src={variant.image.url}
                        width={variant.image.width ?? 2048}
                      />
                    </div>
                    <div css={s({ flexGrow: 1 })}>
                      <p
                        css={s(labelStyle, (t) => ({
                          marginBottom: t.spacing.xxs,
                        }))}
                      >
                        {variant.title}
                      </p>
                      <div css={s(bodyTextSmallStatic)}>
                        <p css={s({ display: "inline-block" })}>
                          <span css={s(visuallyHidden)}>
                            {t("CartOfferPicker:variant.price.current")}:{" "}
                          </span>
                          {formatCurrency(variant.computed.prices.currentPrice)}
                        </p>
                        {variant.computed.prices.currentPrice.amount !==
                          variant.computed.prices.regularPrice.amount && (
                          <p
                            css={s((t) => ({
                              display: "inline-block",
                              marginLeft: t.spacing.xs,
                              opacity: 0.6,
                              textDecoration: "line-through",
                            }))}
                          >
                            <span css={s(visuallyHidden)}>
                              {t("CartOfferPicker:variant.price.rrp")}:{" "}
                            </span>
                            {formatCurrency(
                              variant.computed.prices.regularPrice
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    {!!variant.computed.prices.currentDiscount?.percentage && (
                      <p
                        css={s(labelStyle, (t) => ({
                          color: t.color.accent.light,
                        }))}
                      >
                        {t("CartOfferPicker:variant.price.save", {
                          percentage: variant.computed.prices.currentDiscount.percentage.toFixed(
                            0
                          ),
                        })}
                      </p>
                    )}
                  </div>
                }
                name="sku"
                value={variant.sku}
              />
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default CartOfferPicker;
