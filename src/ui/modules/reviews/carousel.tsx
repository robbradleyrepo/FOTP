import { Elements, Review, RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import {
  belt,
  ComponentStyleProps,
  my,
  px,
  py,
  ratio,
  s,
} from "@/common/ui/utils";

import { OpinionatedRichText } from "../../../cms/prismic";
import { card } from "../../base/card";
import Carousel from "../../base/carousel";
import ResponsiveImage from "../../base/responsive-image";
import { bodyTextStatic, headingDeltaStatic } from "../../base/typography";
import Stars from "./stars";

interface ReviewsCarouselProps extends ComponentStyleProps {
  reviews: Record<"review", Review | null>[];
}

const ReviewsCarousel: FC<ReviewsCarouselProps> = ({ _css = {}, reviews }) => {
  const isMissingAllImages = reviews.every(({ review }) => !review?.image);

  return (
    <Carousel
      _css={s(belt, _css)}
      controls={{ DotContainer: null }}
      gutter={(t) => t.spacing.md}
      innerCss={s((t) => ({
        maxWidth: 1280 + 2 * t.spacing.xs,
        ...my(-t.spacing.xs),
        ...px([t.spacing.md, null, t.spacing.xs]),
        ...py(t.spacing.xs),
      }))}
      slidesToShow={[1.2, 2.2, 3, 4]}
    >
      {reviews.map(({ review }) => {
        if (!review) {
          return null;
        }

        const { _meta, highlight, image, rating, reviewer } = review;

        if (!highlight || !reviewer) {
          return null;
        }

        return (
          <article
            key={_meta.id}
            css={s(card, (t) => ({
              borderRadius: t.radius.md,
              height: "100%",
              maxWidth: 320,
              overflow: "hidden",
            }))}
          >
            {!isMissingAllImages && (
              <div
                css={s(ratio(3 / 4), (t) => ({
                  backgroundColor: t.color.background.dark,
                }))}
              >
                {image && (
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes={{ width: 320 }}
                    src={image.url}
                  />
                )}
              </div>
            )}
            <div
              css={s(bodyTextStatic, (t) => ({
                paddingTop: t.spacing.md,
                ...px(t.spacing.sm),
              }))}
            >
              <h3
                css={s(headingDeltaStatic, (t) => ({
                  marginBottom: t.spacing.xs,
                }))}
              >
                <RichTextFragment render={reviewer} />
              </h3>
              <Stars
                _css={s((t) => ({
                  height: 20,
                  marginBottom: t.spacing.md,
                  width: 120,
                }))}
                value={rating ?? 5}
              />
              <OpinionatedRichText
                components={{
                  [Elements.paragraph]: (
                    <p
                      css={s((t) => ({
                        marginBottom: [t.spacing.sm, null, t.spacing.md],
                      }))}
                    />
                  ),
                }}
                render={highlight}
              />
            </div>
          </article>
        );
      })}
    </Carousel>
  );
};

export default ReviewsCarousel;
