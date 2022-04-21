import { useLocale } from "@sss/i18n";
import React, { FC, ReactNode } from "react";

import {
  ComponentStyleProps,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import StyledComponentsHelper from "../../base/styled-components-helper";
import { bodyTextStatic, headingBravoStatic } from "../../base/typography";
import Stars from "./stars";

type Heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const isValidHeading = (str: string): str is Heading => /^h[1-6]$/.test(str);

interface BarsProps extends ComponentStyleProps {
  value: number;
}

export const Bars: FC<BarsProps> = ({ _css, value }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "Bars", {
    value: "{{ count }} out of 5",
  });

  const itemWidth = 20;
  const gutter = 1;

  const height = 8;
  const width = itemWidth * 5 + gutter * 4;

  return (
    <svg
      css={s(
        (t) => ({
          color: t.color.state.success,
          height,
          width,
        }),
        _css ?? {}
      )}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{t("Bars:value", { count: value })}</title>
      {[0, 1, 2, 3, 4].map((index) => {
        const x1 = index * (itemWidth + gutter);
        const x2 = x1 + itemWidth;
        const y1 = 0;
        const y2 = height;

        return (
          <polygon
            key={index}
            css={s({
              opacity: Math.round(value) > index ? 1 : 0.3,
              shapeRendering: "crispEdges",
            })}
            points={`${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`}
          />
        );
      })}
    </svg>
  );
};

const descriptionListGroup = s({
  flexShrink: 0,
  whiteSpace: "nowrap",
  width: ["100%", null, "auto"],
});

const descriptionListItem = s({
  display: "inline-block",
  verticalAlign: "baseline",
});

const descriptionListTerm = s(descriptionListItem, (t) => ({
  marginRight: t.spacing.sm,
  width: [96, null, "auto"],
}));

interface ReviewHighlightProps extends ComponentStyleProps {
  easeOfUse: number;
  effectiveness: number;
  headingLevel: number;
  initials: string;
  rating: number;
  review: ReactNode;
  reviewer: ReactNode;
  title: ReactNode;
}

export const Review: FC<ReviewHighlightProps> = ({
  _css = {},
  easeOfUse,
  effectiveness,
  headingLevel,
  initials,
  rating,
  review,
  reviewer,
  title,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "Review", {
    easeOfUse: "Ease of use",
    effectiveness: "Effectiveness",
    rating: "Rating",
    reviewer: "Reviewed by",
    verified: "Verified review",
  });

  const headingTag = `h${headingLevel}`;

  if (!isValidHeading(headingTag)) {
    throw new Error("Invalid heading level provided");
  }

  return (
    <article css={s(bodyTextStatic, _css)}>
      <div css={s({ paddingLeft: [null, null, 70], position: "relative" })}>
        <header css={s({ display: "flex", flexDirection: "column-reverse" })}>
          <StyledComponentsHelper
            as={headingTag}
            css={s((t) => ({
              fontSize: 18,
              fontWeight: t.font.primary.weight.medium,
              marginBottom: t.spacing.sm,
            }))}
          >
            {title}
          </StyledComponentsHelper>
          <div
            css={s((t) => ({
              marginBottom: t.spacing.sm,
              paddingLeft: [70, null, 0],
            }))}
          >
            <div
              css={s(headingBravoStatic, (t) => ({
                "&:before": {
                  content: `"${initials}"`,
                },
                alignItems: "center",
                backgroundColor: t.color.background.dark,
                borderRadius: t.radius.xxl,
                color: t.color.text.light.base,
                display: "flex",
                justifyContent: "center",
                left: 0,
                lineHeight: 0,
                position: "absolute",
                ...size(54),
              }))}
            />

            <dl>
              <dt css={s(visuallyHidden)}>{t("Review:reviewer")}</dt>
              <dd
                css={s(({ font, spacing }) => ({
                  "&:after": {
                    content: `"${t("Review:verified")}"`,
                    fontStyle: "italic",
                    fontWeight: font.primary.weight.book,
                    marginLeft: spacing.xs,
                  },
                  fontWeight: font.primary.weight.medium,
                  marginBottom: spacing.xs,
                }))}
              >
                {reviewer}
              </dd>
              <dt css={s(visuallyHidden)}>{t("Review:rating")}</dt>
              <dd>
                <Stars
                  _css={s({ height: 20, width: 120 })}
                  value={rating ?? 5}
                />
              </dd>
            </dl>
          </div>
        </header>
        <div>
          {review}
          <dl
            css={s((t) => ({
              display: "flex",
              flexWrap: "wrap",
              marginTop: t.spacing.md,
            }))}
          >
            <div
              css={s(descriptionListGroup, (t) => ({
                marginBottom: [t.spacing.sm, null, 0],
                marginRight: [null, null, t.spacing.lg],
              }))}
            >
              <dt css={descriptionListTerm}>{t("Review:easeOfUse")}</dt>
              <dd css={descriptionListItem}>
                <Bars value={easeOfUse} />
              </dd>
            </div>
            <div css={s(descriptionListGroup)}>
              <dt css={descriptionListTerm}>{t("Review:effectiveness")}</dt>
              <dd css={descriptionListItem}>
                <Bars value={effectiveness} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
};

export default Review;
