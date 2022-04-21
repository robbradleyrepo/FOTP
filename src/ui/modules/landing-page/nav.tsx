import { LinkResolver, linkResolver } from "@sss/prismic";
import React, { FC } from "react";

import { ComponentStyleProps, px, s } from "@/common/ui/utils";

import {
  LandingPage,
  LandingPageNavStyleType,
  useProductData,
} from "../../../cms/landing-page";
import { primaryButton } from "../../../ui/base/button";
import SalesFunnelHeader from "../sales-funnel-header";

type LandingPageNavProps = ComponentStyleProps &
  Pick<
    LandingPage,
    | "navContact"
    | "navCtaLink"
    | "navCtaText"
    | "navLinksEnabled"
    | "navShopLink"
    | "navStyle"
  >;

const LandingPageNav: FC<LandingPageNavProps> = ({
  _css = {},
  navContact,
  navCtaLink,
  navCtaText,
  navLinksEnabled,
  navShopLink,
  navStyle,
}) => {
  const { ecommerce } = useProductData();

  const shopPath =
    (navShopLink && linkResolver(navShopLink)) ??
    (ecommerce && `/offer/${ecommerce.handle}/expert-lead`);

  if (navLinksEnabled && !shopPath?.match(/^\/(\w|$)/)) {
    throw new Error(
      "Landing page must include a valid shop link or product when navigation links are enabled"
    );
  }

  const faqsPath = ecommerce
    ? `/offer/${ecommerce.handle}/expert-lead#faqs`
    : "/help/faq";

  const cta =
    navCtaLink && navCtaText ? (
      <div css={s((t) => px(t.spacing.sm))}>
        <LinkResolver css={s(primaryButton())} link={navCtaLink}>
          {navCtaText}
        </LinkResolver>
      </div>
    ) : null;

  return (
    <SalesFunnelHeader
      _css={s(
        navStyle === LandingPageNavStyleType.REVERSE
          ? (t) => ({
              backgroundColor: t.color.background.dark,
              color: t.color.text.light.base,
            })
          : {},
        _css
      )}
      cta={cta}
      faqsPath={faqsPath}
      shopPath={shopPath}
      showContact={navContact !== "None"}
      showLinks={navLinksEnabled}
    />
  );
};

export default LandingPageNav;
