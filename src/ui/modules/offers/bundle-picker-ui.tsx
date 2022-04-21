import { PreorderAllocation, PreorderType } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import dynamic from "next/dynamic";
import React, { forwardRef } from "react";
import { Trans } from "react-i18next";

import { belt, s, useTheme } from "@/common/ui/utils";

import { contrastButton } from "../../base/button";
import { bodyText, headingAlpha, headingDelta } from "../../base/typography";
import BundlePickerUI, {
  BundlePickerUIProps,
} from "../products/bundle-picker-ui";
import Rating from "../reviews/rating";

const ButtonElement = dynamic(() => import("../purple-dot/button-element"));

const StockCounter = dynamic(import("./stock-counter"));

const enUsResource = {
  preorderCountdown: {
    description:
      "Now accepting limited preorders for early-June shipping. Only {{ inventory }} tubs remaining for preorder. <strong>Checkout today to secure your order.</strong>",
    title: "Sold out due to high demand.",
  },
};

export type OfferBundlePickerUIProps = Omit<
  BundlePickerUIProps,
  "header" | "submit"
> & {
  preorderAllocation: PreorderAllocation | null;
};

const OfferBundlePickerUI = forwardRef<
  HTMLFormElement,
  OfferBundlePickerUIProps
>(function OfferBundlePickerUI(props, ref) {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "OfferBundlePickerUI", enUsResource);

  const { data, preorderAllocation, variant } = props;

  const {
    ecommerce: { bottomline, subtitle, title },
    meta,
  } = data;

  return (
    <BundlePickerUI
      ref={ref}
      _css={s(belt, bodyText, { maxWidth: 480 })}
      busyAfterSubmit
      header={
        <div
          css={s((t) => ({
            marginBottom: [t.spacing.xl, null, t.spacing.xxl],
          }))}
        >
          <header css={s({ textAlign: "center" })}>
            <h2 css={s(headingAlpha)}>{title}</h2>
            {subtitle && (
              <p
                css={s(headingDelta, (t) => ({
                  fontStyle: "italic",
                  fontWeight: t.font.secondary.weight.book,
                  marginTop: [t.spacing.xxs, null, t.spacing.xs],
                }))}
              >
                {subtitle.value}
              </p>
            )}
            {!!bottomline?.totalReviews && (
              <Rating
                _css={s((t) => ({
                  marginTop: [t.spacing.sm, null, t.spacing.md],
                }))}
                {...bottomline}
              />
            )}
          </header>
          {meta.subscription.preorder.type === PreorderType.SHOPIFY &&
            preorderAllocation && (
              <StockCounter
                _css={s((t) => ({
                  margin: "0 auto",
                  marginTop: [t.spacing.lg, null, t.spacing.xl],
                  maxWidth: 700,
                  textAlign: "center",
                }))}
                content={{
                  description: (
                    <Trans
                      i18nKey="OfferBundlePickerUI:preorderCountdown.description"
                      values={{
                        inventory: preorderAllocation.available,
                      }}
                    />
                  ),
                  title: t("OfferBundlePickerUI:preorderCountdown.title"),
                }}
                to={preorderAllocation.available}
                from={preorderAllocation.allocation}
              />
            )}
        </div>
      }
      submit={({ children, disabled }) =>
        meta.subscription.preorder.type === PreorderType.PURPLE_DOT ? (
          <div
            css={s((t) => ({
              margin: `${t.spacing.lg}px 0`,
              minHeight: 96,
            }))}
          >
            <ButtonElement
              hoverStyle={{
                backgroundColor: theme.color.accent.dark,
              }}
              product={data.ecommerce}
              style={{
                backgroundColor: theme.color.accent.light,
                fontSize: "18px",
                height: "64px",
              }}
              variant={variant}
            />
          </div>
        ) : (
          <button
            css={s(contrastButton({ disabled }), (t) => ({
              fontSize: 18,
              margin: `${t.spacing.lg}px 0`,
              width: "100%!important",
            }))}
            disabled={disabled}
            type="submit"
          >
            {children}
          </button>
        )
      }
      {...props}
    />
  );
});

export default OfferBundlePickerUI;
