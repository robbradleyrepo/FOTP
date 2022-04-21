import Link from "next/link";
import React, { FC } from "react";

import { ComponentStyleProps, my, px, py, s, size } from "@/common/ui/utils";

import { interactiveCard } from "../../base/card";
import ResponsiveImage from "../../base/responsive-image";
import {
  bodyTextSmallStatic,
  bodyTextStatic,
  headingDelta,
} from "../../base/typography";
import type { CoreIngredientProperties } from "./data-mapping";

export type IngredientsCardProps = ComponentStyleProps &
  CoreIngredientProperties;

const IngredientsCard: FC<IngredientsCardProps> = ({
  _css = {},
  image,
  subtitle,
  summary,
  title,
  url,
}) => {
  return (
    <Link href={url}>
      <figure
        css={s(
          interactiveCard,
          (t) => ({
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            ...px([t.spacing.sm, null, t.spacing.md]),
            ...py([t.spacing.md, null, t.spacing.lg]),
            textAlign: "center",
          }),
          _css
        )}
      >
        {image && (
          <span
            css={s({
              ...size(160),
            })}
          >
            <ResponsiveImage
              _css={s((t) => ({
                borderRadius: t.radius.xxl,
              }))}
              alt=""
              height={image.dimensions.height}
              src={image.url}
              width={image.dimensions.width}
              sizes={{ width: 160 }}
            />
          </span>
        )}
        <figcaption
          css={s(bodyTextSmallStatic, (t) => ({
            ...my(t.spacing.md),
          }))}
        >
          <h3>
            <span css={s(headingDelta)}>{title}</span>
            {subtitle && (
              <span
                css={s(bodyTextStatic, (t) => ({
                  display: "block",
                  fontWeight: t.font.primary.weight.medium,
                }))}
              >
                {subtitle}
              </span>
            )}
          </h3>

          <p
            css={s(bodyTextSmallStatic, (t) => ({
              boxOrient: "vertical",
              display: "-webkit-box",
              fontSize: ["16px", null, null],
              lineClamp: 3,
              lineHeight: ["24px", null, null],
              marginTop: t.spacing.xs,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }))}
          >
            {summary}
          </p>
        </figcaption>
        <span
          css={s(bodyTextSmallStatic, (t) => ({
            fontWeight: t.font.primary.weight.bold,
            textDecoration: "underline",
          }))}
        >
          Read more
        </span>
      </figure>
    </Link>
  );
};

export default IngredientsCard;
