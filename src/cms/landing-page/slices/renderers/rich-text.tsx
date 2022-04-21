import { RichTextSlice } from "@sss/prismic";
import React, { FC } from "react";

import { py, s, Style } from "@/common/ui/utils";

import { bodyText } from "../../../../ui/base/typography";
import { useCmsLayout } from "../../../layout";
import { OpinionatedRichText } from "../../../prismic";
import { LandingPageRichTextLabelType } from "../..";

const styles = new Map<string, Style>([
  [
    LandingPageRichTextLabelType.FEATURE_1,
    (t) => ({
      backgroundColor: t.color.background.feature1,
    }),
  ],
  [
    LandingPageRichTextLabelType.FEATURE_2,
    (t) => ({
      backgroundColor: t.color.background.feature6,
    }),
  ],
  [
    LandingPageRichTextLabelType.REVERSE,
    (t) => ({
      backgroundColor: t.color.background.dark,
      color: t.color.text.light.base,
    }),
  ],
]);

const RichTextRenderer: FC<RichTextSlice> = ({
  label,
  primary: { content },
}) => {
  const {
    styles: { belt, gutterX, mb, paddingX },
  } = useCmsLayout();

  const calloutStyle = (label && styles.get(label)) || null;

  return calloutStyle ? (
    <div
      css={s(
        belt,
        mb,
        paddingX,
        bodyText,
        (t) => ({
          "& > :first-child": { marginTop: 0 },
          "& > :last-child": { marginBottom: 0 },
          ...py([t.spacing.lg, null, t.spacing.xl]),
        }),
        calloutStyle
      )}
    >
      <OpinionatedRichText render={content} />
    </div>
  ) : (
    <div css={s(belt, gutterX, mb, bodyText)}>
      <OpinionatedRichText render={content} />
    </div>
  );
};

export default RichTextRenderer;
