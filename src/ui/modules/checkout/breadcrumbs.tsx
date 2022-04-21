import { Checkout } from "@sss/ecommerce/checkout";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, link, mx, s, StyleFn } from "@/common/ui/utils";

import { bodyTextSmallStatic } from "../../base/typography";
import chevronRight from "../../icons/chevronRight";
import { dataUriFromPath } from "../../styles/utils";
import { CheckoutStep, isCheckoutStepReady } from "./common";

const enUsResource = {
  step: {
    cart: "Cart",
    information: "Information",
    payment: "Shipping & payment",
  },
};

const navItem: StyleFn = (t) => ({
  "&:before": {
    ...mx(t.spacing.xs),
    content: `url(${dataUriFromPath({
      fill: t.color.text.dark.base,
      height: t.spacing.xs,
      path: chevronRight,
      width: t.spacing.xs,
    })})`,
    display: "inline-block",
  },
  "&:first-child:before": {
    display: "none",
  },
  display: "inline-block",
});

interface CheckoutBreadcrumbsProps extends ComponentStyleProps {
  checkout: Checkout;
  currentStep: CheckoutStep;
}

const CheckoutBreadcrumbs: FC<CheckoutBreadcrumbsProps> = ({
  _css = {},
  checkout,
  currentStep,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "checkoutBreadcrumbs", enUsResource);

  const steps = [CheckoutStep.INFORMATION, CheckoutStep.PAYMENT];

  return (
    <nav css={s(bodyTextSmallStatic, _css)}>
      <ul>
        <li css={s(navItem)}>
          <Link css={link} to="/cart">
            {t(`checkoutBreadcrumbs:step.cart`)}
          </Link>
        </li>
        {steps.map((step) => {
          const isActive = step === currentStep;
          const isReady = isCheckoutStepReady(checkout, step);

          let fragment = (
            <span css={s({ opacity: 0.5 })}>
              {t(`checkoutBreadcrumbs:step.${step}`)}
            </span>
          );

          if (isActive) {
            fragment = (
              <span
                css={s((t) => ({ fontWeight: t.font.primary.weight.medium }))}
              >
                {t(`checkoutBreadcrumbs:step.${step}`)}
              </span>
            );
          } else if (isReady) {
            fragment = (
              <Link css={link} to={`/checkout/${step}`}>
                {t(`checkoutBreadcrumbs:step.${step}`)}
              </Link>
            );
          }

          return (
            <li key={step} css={s(navItem)}>
              {fragment}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CheckoutBreadcrumbs;
