import { RichTextBlock } from "@sss/prismic";
import React, { FC } from "react";

import { belt, px, s } from "@/common/ui/utils";

import { RichText } from "../../../cms/prismic";
import { bodyTextSmall } from "../../base/typography";

interface LegalBannerProps {
  body: RichTextBlock[];
}

const LegalBanner: FC<LegalBannerProps> = ({ body }) => {
  return (
    <div
      css={s((t) => ({
        backgroundColor: "#f7f7f7",
        paddingBottom: t.spacing.md,
        paddingTop: [t.spacing.md, null, t.spacing.md],
        width: "100%",
        ...px([t.spacing.lg]),
      }))}
    >
      <div
        css={s(belt, bodyTextSmall, (t) => ({
          color: "#717171",
          fontSize: [11, 12],
          fontWeight: t.font.primary.weight.medium,
          lineHeight: "1.4em",
          maxWidth: 680,
          textAlign: "center",
        }))}
      >
        <RichText render={body} />
      </div>
    </div>
  );
};

export default LegalBanner;
