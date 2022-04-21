import { getFetchedImageSrcSet, getFetchedImageUrl } from "@sss/cloudinary";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  px,
  ratio,
  s,
  size,
  useTheme,
} from "@/common/ui/utils";

import { secondaryButton } from "../../base/button";
import Icon from "../../base/icon";
import { bodyTextSmall, headingDelta } from "../../base/typography";
import tick from "../../icons/tick";
import { useCartOfferLayout } from "./layout";

const enUsResource = {
  cta: {
    CART: { full: "Continue to cart", short: "Go to cart" },
    CHECKOUT: {
      full: "Continue to checkout",
      short: "Checkout",
    },
  },
  success: "Added to cart",
};

export const CartOfferBanner: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { destination, referrer, styles } = useCartOfferLayout();
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "cartOfferBanner", enUsResource);

  return (
    <div
      css={s(
        styles.belt,
        {
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        },
        _css
      )}
      role="alert"
    >
      <div
        css={s({
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        })}
      >
        <Icon
          _css={s((t) => ({
            ...size([t.spacing.sm, null, t.spacing.md]),
            color: t.color.state.success,
            display: ["none", "inline-block"],
            flexGrow: 0,
            flexShrink: 0,
            marginRight: [t.spacing.sm, null, t.spacing.md],
          }))}
          path={tick}
        />
        <div
          css={s(ratio(1), size([48, null, null, 64]), (t) => ({
            backgroundColor: t.color.background.feature4,
            flexGrow: 0,
            flexShrink: 0,
          }))}
        >
          <img
            alt=""
            sizes={`(min-width:${theme.breakpoint.lg}px) 64px, 48px`}
            src={getFetchedImageUrl({
              url: referrer.imageUrl,
              width: 64,
            })}
            srcSet={getFetchedImageSrcSet({
              url: referrer.imageUrl,
              widths: [48, 64, 96, 128],
            })}
          />
        </div>
        <div
          css={s((t) => ({
            marginLeft: [t.spacing.sm, null, t.spacing.md],
          }))}
        >
          <h2
            css={s(headingDelta, (t) => ({
              color: t.color.state.success,
              fontSize: [16, null, 18, null, 22],
              marginBottom: t.spacing.xxs,
            }))}
          >
            {t("cartOfferBanner:success")}
          </h2>
          <p css={s(bodyTextSmall)}>
            {referrer.title}{" "}
            {referrer.subtitle && referrer.subtitle !== "Default Title" && (
              <>({referrer.subtitle})</>
            )}
          </p>
        </div>
      </div>
      <Link
        css={s(secondaryButton(), styles.buttonSmall, (t) => ({
          fontSize: [12, null, 14],
          ...px([t.spacing.sm, null, t.spacing.lg]),
          width: "auto",
        }))}
        replace
        to={destination.path}
      >
        <span css={s({ display: [null, null, null, "none"] })}>
          {t(`cartOfferBanner:cta.${destination.type}.short`)}
        </span>
        <span css={s({ display: ["none", null, null, "inline"] })}>
          {t(`cartOfferBanner:cta.${destination.type}.full`)}
        </span>
      </Link>
    </div>
  );
};

export default CartOfferBanner;
