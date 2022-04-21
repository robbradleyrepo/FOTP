import { Money } from "@sss/ecommerce/common";
import { Variant } from "@sss/ecommerce/product";
import { CartWidget, ProductWidget } from "@sss/shopping-gives";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

const containedStyles = s((t) => ({
  ".shoppinggives-tag.contained": {
    "#sg-main-text": {
      fontSize: [12, 14],
    },
    ".cc-shop-give": {
      lineHeight: 0,
      visibility: "hidden",
    },
    ".cc-shop-give:before": {
      content: '"Your purchase saves lives"',
      fontFamily: t.font.secondary.family,
      fontSize: [14, 16],
      lineHeight: 1,
      visibility: "visible",
    },
    ".givebackAmount:before": {
      content: '"We\'ll donate " !important',
      display: "inline !important",
      fontWeight: "normal !important",
    },
    ".preamountText": {
      display: "none !important",
    },
    ".preview-container": {
      marginBottom: [-t.spacing.xxs, null, -t.spacing.xs],
      opacity: 0.7,
    },
    ".sg-open-charity-select": {
      backgroundColor: t.color.background.dark,
      borderColor: t.color.background.dark,
      color: t.color.text.light.base,
      height: 40,
      lineHeight: "40px",
      right: [12, null, t.spacing.md],
    },
    borderColor: t.color.background.dark,
    margin: 0,
    padding: [12, null, t.spacing.md],
  },
}));

interface ShoppingGivesProps extends ComponentStyleProps {
  targetId?: string;
}

export const ShoppingGivesCart: FC<ShoppingGivesProps> = ({
  _css = {},
  targetId,
}) => (
  <CartWidget
    _css={s(containedStyles, { display: ["none", null, "block"] }, _css)}
    targetId={targetId}
  />
);
interface ShoppingGivesProductProps extends ShoppingGivesProps {
  price: Money;
  variant: Variant;
}

export const ShoppingGivesProduct: FC<ShoppingGivesProductProps> = ({
  price,
  targetId,
  variant,
}) => (
  <ProductWidget
    _css={s(containedStyles, (t) => ({
      marginTop: t.spacing.md,
    }))}
    id={variant.id}
    price={price}
    targetId={targetId}
  />
);
