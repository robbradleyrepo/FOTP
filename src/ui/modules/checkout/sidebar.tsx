import { Checkout } from "@sss/ecommerce/checkout";
import { Money } from "@sss/ecommerce/common";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useState } from "react";

import { ComponentStyleProps, px, py, s, size } from "@/common/ui/utils";

import Icon from "../../base/icon";
import { bodyTextSmallStatic, headingDelta } from "../../base/typography";
import chevronDown from "../../icons/chevronDown";
import { height } from "./common";
import CheckoutDiscount from "./discount";
import CheckoutLineItems from "./line-items";
import CheckoutSummary from "./summary";

const enUsResource = {
  hide: "Hide order summary",
  show: "Show order summary",
};

interface CheckoutSidebarProps extends ComponentStyleProps {
  checkout: Checkout;
  shippingThreshold: Money | null;
}

const CheckoutSidebar: FC<CheckoutSidebarProps> = ({
  _css = {},
  checkout,
  shippingThreshold,
}) => {
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();
  const [isHidden, setIsHidden] = useState(true);

  i18n.addResourceBundle("en-US", "checkoutSidebar", enUsResource);

  const {
    completedAt,
    discount,
    lineItems,
    lineItemsSubtotalPrice,
    shippingRate,
    taxLines,
    totalPrice,
    totalShipping,
    totalTax,
  } = checkout;

  // We'll duplicate content for mobile and desktop as it's simpler to use
  // Framer Motion to handle transitions than a pure CSS solution
  // TODO: remove mock content
  const contentFragment = (
    <>
      <CheckoutLineItems lineItems={lineItems} />
      {!completedAt && <CheckoutDiscount discount={discount} />}
      <CheckoutSummary
        discount={discount}
        interactive={!completedAt}
        lineItemsSubtotalPrice={lineItemsSubtotalPrice}
        shippingRate={shippingRate}
        shippingThreshold={shippingThreshold}
        taxLines={taxLines}
        totalPrice={totalPrice}
        totalShipping={totalShipping}
        totalTax={totalTax}
      />
    </>
  );

  return (
    <aside css={s(_css)}>
      <button
        css={s((t) => ({
          ...px(t.spacing.md),
          alignItems: "center",
          backgroundColor: t.color.background.feature1,
          display: ["flex", null, "none"],
          height: height.summary,
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
          zIndex: 1,
        }))}
        onClick={() => setIsHidden(!isHidden)}
      >
        <span css={s(bodyTextSmallStatic)}>
          {t(`checkoutSidebar:${isHidden ? "show" : "hide"}`)}
          <Icon
            _css={s((t) => ({
              ...size(10),
              marginLeft: t.spacing.xs,
              transform: isHidden ? null : "rotate(180deg)",
              transition: "transform 500ms",
            }))}
            path={chevronDown}
          />
        </span>
        <span css={s(headingDelta)}>{formatCurrency(totalPrice)}</span>
      </button>
      <div
        css={s((t) => ({
          backgroundColor: t.color.background.feature1,
          height: "100%",
        }))}
      >
        {/* Mobile content */}
        <div
          css={s({
            display: [null, null, "none"],
            overflow: "hidden",
          })}
        >
          <AnimatePresence>
            {!isHidden && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                exit={{ height: 0 }}
              >
                <div
                  css={s((t) => ({
                    ...px(t.spacing.md),
                    ...py(t.spacing.lg),
                    borderTopColor: t.color.border.light,
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                  }))}
                  data-track="checkout-summary-mobile"
                >
                  {contentFragment}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          css={s((t) => ({
            display: ["none", null, "block"],
            padding: [t.spacing.lg, null, null, t.spacing.xl],
          }))}
          data-track="checkout-summary-desktop"
        >
          {contentFragment}
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSidebar;
