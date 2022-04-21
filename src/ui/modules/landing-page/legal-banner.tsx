import React from "react";

import { s } from "@/common/ui/utils";

import { bodyTextExtraSmall } from "../../base/typography";

const LegalBanner = () => {
  return (
    <div
      css={s(bodyTextExtraSmall, (t) => ({
        backgroundColor: "#f7f7f7",
        color: t.color.text.dark.base,
        fontWeight: t.font.primary.weight.medium,
        lineHeight: "1.2em",
        padding: t.spacing.xs,
        textAlign: "center",
      }))}
    >
      Advertorial
    </div>
  );
};

export default LegalBanner;
