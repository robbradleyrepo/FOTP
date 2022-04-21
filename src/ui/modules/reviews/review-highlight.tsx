import React, { FC, ReactNode } from "react";

import { belt, ComponentStyleProps, px, py, s } from "@/common/ui/utils";

import { bodyTextStatic } from "../../base/typography";
import Stars from "./stars";

interface ReviewHighlightProps extends ComponentStyleProps {
  highlight: ReactNode;
  rating: number;
  reviewer?: ReactNode;
}

export const ReviewHighlight: FC<ReviewHighlightProps> = ({
  _css = {},
  highlight,
  rating,
  reviewer,
}) => (
  <figure
    css={s(
      (t) => ({
        ...px([t.spacing.md, null, t.spacing.lg]),
        ...py([t.spacing.lg, null, t.spacing.xl]),
      }),
      _css
    )}
  >
    <blockquote
      css={s(belt, (t) => ({
        fontFamily: t.font.secondary.family,
        fontSize: 18,
        fontStyle: "italic",
        maxWidth: 640,
      }))}
    >
      <Stars _css={s({ height: 20, width: 120 })} value={rating ?? 5} />
      <div
        css={s((t) => ({
          "&:after": { content: "'”'" },
          "&:before": { content: "'“'" },
          marginTop: t.spacing.sm,
        }))}
      >
        {highlight}
      </div>
    </blockquote>
    {reviewer && (
      <figcaption
        css={s(bodyTextStatic, (t) => ({
          marginTop: t.spacing.sm,
        }))}
      >
        {reviewer}
      </figcaption>
    )}
  </figure>
);

export default ReviewHighlight;
