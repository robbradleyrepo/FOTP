import { PreorderType, ProductComputedMetadata } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import React, { FC } from "react";
import { Link as ScrollLink } from "react-scroll";

import { belt, gutter, s } from "@/common/ui/utils";

import { useProductPageData } from "../../../cms/product-page";
import { contrastButton } from "../../base/button";
import { headingAlpha } from "../../base/typography";
import { ReviewsProductWidget } from "../reviews/widgets";

const enUsResource = {
  cta: "Buy now",
  ctaPreorder: "Preorder now",
  title: "What our customers are saying?",
};

interface ReviewsProps {
  meta: ProductComputedMetadata;
}

const Reviews: FC<ReviewsProps> = ({ meta }) => {
  const { t, i18n } = useLocale();
  const { ecommerce } = useProductPageData();

  i18n.addResourceBundle("en-US", "reviews", enUsResource);

  return ecommerce.bottomline?.totalReviews ? (
    <section css={s(gutter, (t) => ({ paddingTop: t.spacing.md }))}>
      <div id="product-reviews">
        <div css={s(belt, { maxWidth: 1024 })}>
          <h2
            css={s(headingAlpha, (t) => ({
              marginBottom: t.spacing.lg,
              textAlign: "center",
            }))}
          >
            {t("reviews:title")}
          </h2>
          <ReviewsProductWidget product={ecommerce} />
          <ScrollLink
            css={s((t) => ({
              display: "block",
              marginTop: t.spacing.xxl,
              textAlign: "center",
            }))}
            duration={500}
            href="#bundles"
            offset={-100}
            smooth={true}
            to="bundles"
          >
            <span
              css={s(contrastButton(), {
                fontSize: 18,
                maxWidth: ["none", null, 360],
                width: "100%!important",
              })}
            >
              {meta.subscription.preorder.type !== PreorderType.NONE
                ? t("reviews:ctaPreorder")
                : t("reviews:cta")}
            </span>
          </ScrollLink>
        </div>
      </div>
    </section>
  ) : null;
};

export default Reviews;
