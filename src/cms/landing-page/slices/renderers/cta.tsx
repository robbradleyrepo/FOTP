import { LinkResolver } from "@sss/prismic";
import React, { FC, MouseEvent } from "react";

import { belt, s } from "@/common/ui/utils";

import { primaryButton, secondaryButton } from "../../../../ui/base/button";
import { useCmsLayout } from "../../../layout";
import { CtaSlice, useLandingPageSliceZoneContext } from "../";

const CtaRenderer: FC<CtaSlice> = ({ primary: { link, text, type } }) => {
  const {
    styles: { mb, gutterX },
  } = useCmsLayout();
  const { onCtaClick } = useLandingPageSliceZoneContext();

  if (!link || !text) {
    return null;
  }

  const isPrimary = type !== "Secondary";

  return (
    <div css={s(gutterX, mb)}>
      <LinkResolver
        css={s(belt, isPrimary ? primaryButton() : secondaryButton(), (t) => ({
          display: "block",
          marginBottom: t.spacing.xl,
          maxWidth: 375,
        }))}
        link={link}
        onClick={(event: MouseEvent) =>
          onCtaClick?.({ link, text, type }, event)
        }
      >
        {text}
      </LinkResolver>
    </div>
  );
};

export default CtaRenderer;
