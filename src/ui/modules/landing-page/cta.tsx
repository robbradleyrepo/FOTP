import { LinkResolver, RichTextFragment } from "@sss/prismic";
import React, { FC, MouseEvent } from "react";

import {
  ComponentStyleProps,
  px,
  py,
  s,
  useContrastingText,
  useTheme,
} from "@/common/ui/utils";

import {
  LandingPage,
  LandingPageImageStyleType,
} from "../../../cms/landing-page";
import { CtaClickEventHandler } from "../../../cms/landing-page/slices";
import { contrastButton } from "../../base/button";
import ResponsiveImage from "../../base/responsive-image";
import { headingDeltaStatic } from "../../base/typography";

type LandingPageCtaProps = ComponentStyleProps &
  Pick<
    LandingPage,
    | "ctaBackgroundColor"
    | "ctaDescription"
    | "ctaImage"
    | "ctaImageStyle"
    | "ctaLink"
    | "ctaText"
    | "ctaTitle"
  > & { onCtaClick?: CtaClickEventHandler };

const LandingPageCta: FC<LandingPageCtaProps> = ({
  _css = {},
  ctaBackgroundColor,
  ctaDescription: description,
  ctaImage: image,
  ctaImageStyle: imageStyle,
  ctaLink: link,
  ctaText: text,
  ctaTitle: title,
  onCtaClick,
}) => {
  const theme = useTheme();

  const backgroundColor = ctaBackgroundColor ?? theme.color.background.feature1;
  const color = useContrastingText(backgroundColor);

  if (!link || !text) {
    return null;
  }

  const isBackgroundImage =
    !imageStyle || imageStyle === LandingPageImageStyleType.BACKGROUND;

  return (
    <div
      css={s(
        (t) => ({
          backgroundColor: [null, null, null, backgroundColor],
          borderColor: t.color.border.dark,
          borderStyle: ["none", null, null, "solid"],
          borderWidth: 3,
          bottom: [0, null, null, "auto"],
          color,
          display: "flex",
          flexDirection: "column-reverse",
          left: [0, null, null, "auto"],
          overflow: "hidden",
          paddingBottom: [t.spacing.md, null, null, t.spacing.lg],
          paddingTop: isBackgroundImage
            ? [null, null, null, t.spacing.sm]
            : null,
          position: ["fixed", null, null, "sticky"],
          textAlign: "center",
          top: [null, null, null, t.height.nav.desktop + t.spacing.xxl],
          width: "100%",
          zIndex: 1,
        }),
        _css
      )}
    >
      <div css={s((t) => px([t.spacing.md, null, null, t.spacing.lg]))}>
        <div css={s({ display: ["none", null, null, "block"] })}>
          {title && (
            <h2
              css={s(headingDeltaStatic, (t) => ({
                marginBottom: t.spacing.xs,
              }))}
            >
              <RichTextFragment render={title} />
            </h2>
          )}
          {description && (
            <p
              css={s(headingDeltaStatic, (t) => ({
                fontSize: 16,
                fontStyle: "italic",
                fontWeight: t.font.secondary.weight.book,
                lineHeight: "20px",
                marginBottom: t.spacing.sm,
              }))}
            >
              <RichTextFragment render={description} />
            </p>
          )}
        </div>
        <LinkResolver
          css={s(contrastButton(), (t) => ({
            boxShadow: ["0 4px 10px rgba(0, 0, 0, 0.2)", null, null, "none"],
            fontSize: [12, null, 14, 12],
            maxWidth: [400, null, null, 200],
            ...px([t.spacing.sm, null, t.spacing.md]),
            ...py([14, null, 17]),
            width: "100%",
          }))}
          link={link}
          onClick={(event: MouseEvent) =>
            onCtaClick?.({ link, text, type: "Sticky" }, event)
          }
        >
          {text}
        </LinkResolver>
      </div>
      {image && (
        <div
          css={s((t) => ({
            display: ["none", null, null, "block"],
            marginBottom: isBackgroundImage ? -t.spacing.xs : null,
            padding: isBackgroundImage ? null : t.spacing.md,
            position: "relative",
            zIndex: -1,
          }))}
        >
          <ResponsiveImage
            alt={image.alt ?? ""}
            height={image.dimensions.height}
            src={image.url}
            sizes={{ width: 294 }}
            width={image.dimensions.width}
          />
        </div>
      )}
    </div>
  );
};

export default LandingPageCta;
