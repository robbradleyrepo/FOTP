import { ImageSlice, LinkResolver, RichText } from "@sss/prismic";
import React, { FC, Fragment } from "react";
import { PrismicImage } from "src/cms/prismic";

import { s } from "@/common/ui/utils";

import StyledComponentsHelper from "../../../ui/base/styled-components-helper";
import { bodyTextSmall } from "../../../ui/base/typography";
import { useCmsLayout } from "../../layout";

const ImageRenderer: FC<ImageSlice> = ({
  primary: { caption, image, link },
}) => {
  const {
    maxWidth,
    styles: { belt, mb },
  } = useCmsLayout();

  if (!image) return null;

  let imageFragment = (
    <PrismicImage image={image} sizes={{ maxWidth: maxWidth.primary }} />
  );

  if (link) {
    imageFragment = (
      <LinkResolver components={{ fallback: Fragment }} link={link}>
        {imageFragment}
      </LinkResolver>
    );
  }

  return (
    <StyledComponentsHelper as={caption ? "figure" : "div"} css={s(belt, mb)}>
      {imageFragment}
      {caption && (
        <figcaption
          css={s(bodyTextSmall, (t) => ({
            fontStyle: "italic",
            marginTop: [t.spacing.sm, null, t.spacing.md],
            textAlign: "center",
          }))}
        >
          <RichText render={caption} />
        </figcaption>
      )}
    </StyledComponentsHelper>
  );
};

export default ImageRenderer;
