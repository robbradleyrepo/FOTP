import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import { headingBravo } from "../../../../../ui/base/typography";
import { ReviewsProductWidget } from "../../../../../ui/modules/reviews/widgets";
import { useCmsLayout } from "../../../../layout";
import { useProductData } from "../../../";

const enUsResource = {
  title: "Customer reviews",
};

const ProductReviews: FC = () => {
  const {
    styles: { belt, mb, paddingX },
  } = useCmsLayout();
  const { ecommerce } = useProductData();

  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "phReviews", enUsResource);

  if (!ecommerce) {
    return null;
  }

  return (
    <div css={s(belt, mb, paddingX)}>
      <h2 css={s(headingBravo, { textAlign: "center" })}>
        {t("phReviews:title")}
      </h2>
      <ReviewsProductWidget product={ecommerce} />
    </div>
  );
};

export default ProductReviews;
