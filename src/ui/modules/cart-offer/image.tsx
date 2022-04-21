import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { ComponentStyleProps, s, useTheme } from "@/common/ui/utils";

import MONEY_BACK_IMG from "../../../assets/images/offers/MONEY_BACK.png";
import ResponsiveImage from "../../base/responsive-image";

const enUsResource = {
  guarantee: "90 day money back guarantee",
};

interface CartOfferImageProps extends ComponentStyleProps {
  image: StaticImageData;
}

const CartOfferImage: FC<CartOfferImageProps> = ({ _css = {}, image }) => {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "cartOfferImage", enUsResource);

  const dimensions = {
    height: 1852,
    width: 2068,
  };

  return (
    <div css={s({ position: "relative" }, _css)}>
      <ResponsiveImage
        alt=""
        {...dimensions}
        priority
        sizes={`(min-width:520px) 520px, 100vw`}
        {...image}
      />
      <div
        css={s((t) => ({
          bottom: "auto",
          height: "auto",
          left: "auto",
          position: "absolute",
          right: [t.spacing.lg, t.spacing.xl, null, t.spacing.lg],
          top: [t.spacing.md, t.spacing.lg, null, t.spacing.md],
          width: [100, 130, null, 100],
        }))}
      >
        <ResponsiveImage
          alt={t("cartOfferImage:guarantee")}
          priority
          sizes={`(min-width:${theme.breakpoint.lg}px) 100px, (min-width:${theme.breakpoint.sm}px) 130px, 100px`}
          src={MONEY_BACK_IMG}
        />
      </div>
    </div>
  );
};

export default CartOfferImage;
