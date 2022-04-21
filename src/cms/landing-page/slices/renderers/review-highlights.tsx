import { Review, RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import ReviewHighlight from "../../../../ui/modules/reviews/review-highlight";
import { useCmsLayout } from "../../../layout";
import { ReviewHighlightsSlice } from "../../slices";

interface RenderableReview extends Review {
  highlight: NonNullable<Review["highlight"]>;
}

const isRenderableReview = (
  review: Review | RenderableReview | null
): review is RenderableReview => !!review?.highlight;

const ReviewHighlightsRenderer: FC<ReviewHighlightsSlice> = ({ fields }) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();

  const reviews: RenderableReview[] = fields
    .map(({ review }) => review)
    .filter(isRenderableReview);

  return reviews.length ? (
    <div css={s(belt, gutterX, mb, { textAlign: "center" })}>
      {reviews.map(({ _meta, highlight, rating, reviewer }, index) => (
        <ReviewHighlight
          key={_meta.id}
          _css={s((t) => ({
            backgroundColor: index % 2 ? null : t.color.background.feature3,
          }))}
          highlight={<RichTextFragment render={highlight} />}
          rating={rating ?? 5}
          reviewer={reviewer && <RichTextFragment render={reviewer} />}
        />
      ))}
    </div>
  ) : null;
};

export default ReviewHighlightsRenderer;
