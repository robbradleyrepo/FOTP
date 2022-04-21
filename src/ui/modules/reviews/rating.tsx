import { Bottomline } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { ComponentStyleProps, link, s } from "@/common/ui/utils";

import { bodyTextStatic } from "../../base/typography";
import Stars from "./stars";

interface RatingProps extends Bottomline, ComponentStyleProps {
  clickable?: boolean;
}

const Rating: FC<RatingProps> = ({
  _css = {},
  averageScore,
  clickable,
  totalReviews,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "Rating", {
    totalReviews_one: "{{ count }} Review",
    totalReviews_other: "{{ count }} Reviews",
  });

  return (
    <div css={s({ whiteSpace: "nowrap" }, _css)}>
      <Stars
        _css={s((t) => ({
          height: t.spacing.sm,
          marginTop: "-0.4em",
          verticalAlign: "middle",
          width: 6 * t.spacing.sm,
        }))}
        value={averageScore}
      />
      {totalReviews > 0 && (
        <span
          css={s(bodyTextStatic, clickable ? link : {}, (t) => ({
            display: "inline-block",
            fontWeight: t.font.primary.weight.medium,
            marginLeft: t.spacing.xs,
            verticalAlign: "middle",
          }))}
        >
          {t("Rating:totalReviews", { count: totalReviews })}
        </span>
      )}
    </div>
  );
};

export default Rating;
