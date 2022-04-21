import { LinkResolver, RichTextFragment } from "@sss/prismic";
import React, { FC, MouseEvent } from "react";

import {
  percentage,
  px,
  py,
  s,
  Style,
  useContrastingText,
  useTheme,
} from "@/common/ui/utils";

import { contrastButton } from "../../../../ui/base/button";
import ResponsiveImage from "../../../../ui/base/responsive-image";
import { headingDelta } from "../../../../ui/base/typography";
import { useCmsLayout } from "../../../layout";
import { LandingPageImageStyleType } from "../..";
import { EnhancedCtaSlice, useLandingPageSliceZoneContext } from "../";

const EnhancedCtaRenderer: FC<EnhancedCtaSlice> = ({
  primary: {
    backgroundColor: customBackgroundColor,
    description,
    image,
    imageStyle,
    link,
    text,
    title,
  },
}) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();
  const { onCtaClick } = useLandingPageSliceZoneContext();
  const theme = useTheme();

  const backgroundColor =
    customBackgroundColor ?? theme.color.background.feature1;
  const color = useContrastingText(backgroundColor);
  const imageMediaQuery = "@media(min-width: 360px)";

  if (!link || !text) {
    return null;
  }

  const isBackgroundImage =
    !imageStyle || imageStyle === LandingPageImageStyleType.BACKGROUND;

  const imageMaxWidth = image
    ? Math.round(240 * (image.dimensions.width / image.dimensions.height)) // 240px high, regardless of width
    : null;

  const styles: Record<"image" | "text" | "wrapper", Style> = {
    image: (t) => ({
      display: ["none", "block"],
      flexGrow: 0,
      flexShrink: 0,
      marginRight: [t.spacing.md, null, t.spacing.lg],
      maxWidth: imageMaxWidth,
      width: ["40%"],
    }),
    text: {
      textAlign: ["center", "left"],
    },
    wrapper: (t) => ({
      alignItems: "center",
      backgroundColor,
      color,
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      ...px([t.spacing.md, t.spacing.sm, t.spacing.md]),
      ...py([t.spacing.sm, null, t.spacing.md]),
    }),
  };

  if (isBackgroundImage) {
    styles.image = s(styles.image, {
      [imageMediaQuery]: {
        display: "block",
      },
      display: "none", // eslint-disable-line sort-keys
      height: "100%",
      left: "25%",
      marginRight: null,
      maxWidth: imageMaxWidth,
      position: "absolute",
      textAlign: null,
      top: 0,
      transform: "translateX(-66.666%)",
      width: "100%",
    });
    styles.text = s(styles.text, (t) => ({
      [imageMediaQuery]: {
        marginLeft: percentage(1 / 3),
        paddingLeft: 0,
        ...py(t.spacing.md),
      },
      // We can't use array notation for any values changed in the
      // `imageMediaQuery` breakpoint otherwise the order will be
      // incorrect - the `imageMediaQuery` will override larger
      // breakpoints
      [`@media(min-width: ${theme.breakpoint.md}px)`]: {
        ...py(t.spacing.lg),
      },
      paddingLeft: t.spacing.sm,
      paddingRight: [t.spacing.sm, t.spacing.md, t.spacing.lg, t.spacing.xl],
      ...py(t.spacing.sm),
      position: "relative",
      zIndex: 1,
    }));
    styles.wrapper = s(styles.wrapper, {
      display: "block",
      ...px(null),
      ...py(null),
    });
  }

  return (
    <div css={s(belt, gutterX, mb)}>
      <div css={s(styles.wrapper)}>
        <div css={s(styles.text)}>
          <div css={s({ maxWidth: 380 })}>
            {title && (
              <h2
                css={s(headingDelta, (t) => ({
                  display: ["none", null, "block"],
                  marginBottom: t.spacing.xs,
                }))}
              >
                <RichTextFragment render={title} />
              </h2>
            )}
            {description && (
              <p
                css={s(headingDelta, (t) => ({
                  fontSize: [16, null, 18],
                  fontStyle: "italic",
                  fontWeight: t.font.secondary.weight.book,
                  lineHeight: ["20px", null, "24px"],
                  marginBottom: t.spacing.sm,
                }))}
              >
                <RichTextFragment render={description} />
              </p>
            )}
            <LinkResolver
              css={s(contrastButton(), (t) => ({
                fontSize: [12, null, 14],
                ...px([t.spacing.sm, null, t.spacing.md]),
                ...py([14, null, 17]),
              }))}
              link={link}
              onClick={(event: MouseEvent) =>
                onCtaClick?.({ link, text, type: "Enhanced" }, event)
              }
            >
              {text}
            </LinkResolver>
          </div>
        </div>
        {image && (
          <div css={s(styles.image)}>
            {isBackgroundImage ? (
              <ResponsiveImage
                alt={image.alt ?? ""}
                layout="fill"
                objectFit="contain"
                objectPosition="66.666%"
                src={image.url}
                sizes={{
                  maxWidth: imageMaxWidth,
                  width: "100vw",
                }}
              />
            ) : (
              <ResponsiveImage
                {...image.dimensions}
                alt={image.alt ?? ""}
                src={image.url}
                sizes={{
                  maxWidth: imageMaxWidth,
                  width: "40vw",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCtaRenderer;
