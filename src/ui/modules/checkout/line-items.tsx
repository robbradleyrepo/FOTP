import { getFetchedImageUrl } from "@sss/cloudinary";
import { Checkout, LineItem } from "@sss/ecommerce/checkout";
import { moneyFns } from "@sss/ecommerce/common";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  px,
  py,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import { img } from "../../base/image";
import { bodyTextSmallStatic, bodyTextStatic } from "../../base/typography";
import Frequency from "../frequency";

const checkoutLineItemEnUsResource = {
  interval: {
    label: "Frequency",
  },
  price: {
    label: "Price",
  },
  quantity: {
    label: "Quantity",
  },
  title: {
    label: "Product name",
  },
  variant: {
    label: "Bundle size",
  },
};

const CheckoutLineItem: FC<LineItem> = ({
  frequency,
  image,
  linePrice,
  title,
  quantity,
  variantTitle,
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "checkoutLineItems",
    checkoutLineItemEnUsResource
  );

  return (
    <div
      css={s({
        alignItems: "stretch",
        display: "flex",
        flexDirection: "row",
        justifyContent: "stretch",
      })}
    >
      <div
        css={s({
          flexGrow: 0,
          flexShrink: 0,
        })}
      >
        <img
          alt=""
          css={s(img, (t) => ({
            ...size(72),
            backgroundColor: t.color.background.feature4,
          }))}
          src={getFetchedImageUrl({
            url: image,
            width: 200,
          })}
        />
      </div>
      <dl
        css={s(bodyTextSmallStatic, (t) => ({
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
          paddingLeft: t.spacing.md,
          paddingRight: t.spacing.xxl,
          position: "relative",
        }))}
      >
        <dt css={s(visuallyHidden)}>{t("checkoutLineItems:title.label")}</dt>
        <dd css={s(bodyTextStatic)}>{title}</dd>
        {variantTitle && (
          <>
            <dt css={s(visuallyHidden)}>
              {t("checkoutLineItems:variant.label")}
            </dt>
            <dd>{variantTitle}</dd>
          </>
        )}
        {frequency && (
          <>
            <dt css={s(visuallyHidden)}>
              {t("checkoutLineItems:interval.label")}
            </dt>
            <dd
              css={s((t) => ({
                marginTop: t.spacing.xs,
              }))}
            >
              <Frequency {...frequency} />
            </dd>
          </>
        )}
        <dt css={s(visuallyHidden)}>{t("checkoutLineItems:quantity.label")}</dt>
        <dd
          css={s((t) => ({
            ...px(t.spacing.xxs),
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: t.radius.xxl,
            display: "flex",
            fontSize: 12,
            height: 20,
            justifyContent: "center",
            left: 0,
            minWidth: 20,
            position: "absolute",
            top: 0,
            transform: "translate(-50%, -50%)",
          }))}
        >
          <span css={s({ position: "relative", top: 1 })}>{quantity}</span>
        </dd>
        <dt css={s(visuallyHidden)}>{t("checkoutLineItems:price.label")}</dt>
        <dd
          css={s(bodyTextStatic, {
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          })}
        >
          {moneyFns.toFloat(linePrice) !== 0
            ? formatCurrency(linePrice)
            : t("common:free")}
        </dd>
      </dl>
    </div>
  );
};

type CheckoutLineItemsProps = Pick<Checkout, "lineItems"> & ComponentStyleProps;

const CheckoutLineItems: FC<CheckoutLineItemsProps> = ({
  _css = {},
  lineItems,
}) => (
  <ul
    css={s(
      (t) => ({
        flexGrow: 1,
        flexShrink: 1,
        marginTop: -t.spacing.md,
        overflowY: "auto",
      }),
      _css
    )}
  >
    {lineItems.map((lineItem) => (
      <li
        key={lineItem.id}
        css={s((t) => ({
          ...py(t.spacing.md),
          borderBottomColor: "rgba(47, 78, 37, 0.15)",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
        }))}
      >
        <CheckoutLineItem {...lineItem} />
      </li>
    ))}
  </ul>
);

export default CheckoutLineItems;
