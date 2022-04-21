import { useLocale } from "@sss/i18n";
import {
  renderAsString,
  Review as IReview,
  RichTextFragment,
} from "@sss/prismic";
import React, { FC } from "react";

import { py, s, visuallyHidden } from "@/common/ui/utils";

import { headingBravo } from "../../../../ui/base/typography";
import Rating from "../../../../ui/modules/reviews/rating";
import Review from "../../../../ui/modules/reviews/review";
import { useCmsLayout } from "../../../layout";
import { RichText } from "../../../prismic";
import { useProductData } from "../../";
import { ProductReviewsSlice } from "../../slices";

const optionalReviewProperties = ["image"] as const;

type RenderableReview = IReview &
  {
    [K in Exclude<
      keyof IReview,
      typeof optionalReviewProperties[number]
    >]-?: NonNullable<IReview[K]>;
  };

const isRenderableReview = (
  review: IReview | RenderableReview | null
): review is RenderableReview =>
  !!review &&
  !Object.entries(review).some(
    ([key, value]) =>
      !(optionalReviewProperties as readonly string[]).includes(key) &&
      value === null
  );

const ReviewHighlightsRenderer: FC<ProductReviewsSlice> = ({ fields }) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();
  const { ecommerce } = useProductData();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ReviewHighlightsRenderer", {
    title: "Customer reviews",
  });

  const reviews: RenderableReview[] = fields
    .map(({ review }) => review)
    .filter(isRenderableReview);

  return reviews.length ? (
    <div css={s(belt, gutterX, mb)}>
      <header>
        <h2 css={s(visuallyHidden)}>{t("ReviewHighlightsRenderer:title")}</h2>
        {ecommerce?.bottomline && ecommerce.bottomline.totalReviews > 0 && (
          <p
            css={s((t) => ({
              marginBottom: t.spacing.lg,
              marginTop: [t.spacing.sm, null, t.spacing.md],
              textAlign: "center",
            }))}
          >
            <Rating
              _css={s((t) => ({
                "&:before": ecommerce.bottomline
                  ? {
                      ...headingBravo(t),
                      content: `"${ecommerce.bottomline.averageScore}"`,
                      marginBottom: -t.spacing.xs,
                      marginRight: [t.spacing.sm, null, t.spacing.md],
                      position: "relative",
                      top: t.spacing.xxs,
                    }
                  : {},
                display: "inline-block",
              }))}
              {...ecommerce.bottomline}
            />
          </p>
        )}
      </header>
      {reviews.map(
        (
          { _meta, body, easeOfUse, effectiveness, rating, reviewer, title },
          index
        ) => (
          <Review
            key={_meta.id}
            _css={s((t) => ({
              borderColor: t.color.border.light,
              borderStyle: "solid",
              /* eslint-disable sort-keys */
              borderWidth: 0,
              borderBottomWidth: 1,
              borderTopWidth: index === 0 ? 1 : 0,
              /* eslint-enable sort-keys */
              ...py(t.spacing.lg),
            }))}
            easeOfUse={easeOfUse}
            effectiveness={effectiveness}
            headingLevel={3}
            initials={renderAsString(reviewer).trim()[0]}
            rating={rating}
            review={<RichText render={body} />}
            reviewer={<RichTextFragment render={reviewer} />}
            title={<RichTextFragment render={title} />}
          />
        )
      )}
    </div>
  ) : null;
};

export default ReviewHighlightsRenderer;
