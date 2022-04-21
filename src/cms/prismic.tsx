import { CloudinaryFetchedAnimation } from "@sss/cloudinary";
import {
  ElementRendererDict,
  Elements,
  Image,
  LinkResolver,
  RichText as RichTextBase,
  RichTextBlock,
} from "@sss/prismic";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  ResponsiveImageProperties,
  s,
  StyleFn,
} from "@/common/ui/utils";

import ResponsiveImage from "../ui/base/responsive-image";
import {
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../ui/base/typography";
import LazyLoading from "../ui/modules/lazy-loading";

export const prismicImageToStaticImage = ({
  dimensions: { height, width },
  url,
}: Image): StaticImageData => ({
  height,
  src: url,
  width,
});

interface PrismicImageProps extends ComponentStyleProps {
  image: Image;
  sizes: string | ResponsiveImageProperties;
  priority?: true;
}

export const PrismicImage: FC<PrismicImageProps> = ({
  image,
  priority,
  sizes,
}) => {
  if (new URL(image.url).pathname.endsWith(".gif")) {
    const width = Math.min(1840, image.dimensions.width);

    return (
      <LazyLoading>
        <CloudinaryFetchedAnimation
          _css={s({
            height: "auto",
            margin: "auto",
            maxHeight: "100vh",
            width: "auto",
          })}
          url={image.url}
          width={width}
        />
      </LazyLoading>
    );
  } else {
    return (
      <ResponsiveImage
        alt={image.alt ?? ""}
        height={image.dimensions.height}
        layout="responsive"
        priority={priority}
        sizes={sizes}
        src={image.url}
        width={image.dimensions.width}
      />
    );
  }
};

export const RichTextImage: FC<
  ComponentStyleProps & (Image | Record<string, never>)
> = ({ _css = {}, alt = null, dimensions, url }) => {
  if (!dimensions || !url) {
    return null;
  }

  return (
    <figure
      css={s(
        {
          "&:last-child": {
            marginBottom: 0,
          },
          marginBottom: "1.5em",
        },
        _css
      )}
    >
      <PrismicImage image={{ alt, dimensions, url }} sizes="100vw" />
    </figure>
  );
};

export interface RichTextProps {
  components?: Partial<ElementRendererDict>;
  render: RichTextBlock[];
}

export const RichText: FC<RichTextProps> = ({ components, render }) => (
  <RichTextBase
    components={{
      [Elements.image]: <RichTextImage />,
      [Elements.paragraph]: (
        <p
          css={s({
            "&:last-child": {
              marginBottom: 0,
            },
            marginBottom: "1.5em",
          })}
        />
      ),
      ...components,
    }}
    render={render}
  />
);

const my: StyleFn = (t) => ({
  marginBottom: [t.spacing.sm, null, t.spacing.md],
  marginTop: [t.spacing.md, null, t.spacing.lg],
});

const commonListStyles = {
  paddingLeft: "1.2em",
};

const commonListItemStyles = {
  "&:last-child": {
    marginBottom: 0,
  },
  marginBottom: "1.2em",
};

export const OpinionatedRichText: FC<RichTextProps> = ({
  components,
  render,
}) => (
  <RichTextBase
    components={{
      [Elements.heading1]: (
        <h2
          css={s(headingBravo, (t) => ({
            marginBottom: [t.spacing.lg, null, t.spacing.xl],
            marginTop: [t.spacing.lg, null, t.spacing.xl],
          }))}
        />
      ),

      [Elements.heading2]: <h3 css={s(my, headingCharlie)} />,
      [Elements.heading3]: <h4 css={s(my, headingDelta)} />,
      [Elements.heading4]: <h5 css={s(my, headingEcho)} />,
      [Elements.list]: (
        <ul css={s(my, commonListStyles, { listStyle: "disc" })} />
      ),
      [Elements.hyperlink]: (
        <LinkResolver css={s({ textDecoration: "underline" })} />
      ),
      [Elements.listItem]: <li css={s(commonListItemStyles)} />,

      [Elements.oList]: (
        <ol css={s(my, commonListStyles, { listStyle: "decimal" })} />
      ),

      [Elements.oListItem]: <li css={s(commonListItemStyles)} />,

      [Elements.paragraph]: <p css={s(my)} />,
      ...components,
    }}
    render={render}
  />
);
