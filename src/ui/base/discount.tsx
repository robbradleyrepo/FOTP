import React, { FC } from "react";

import { ComponentStyleProps, s, size, StyleFn } from "@/common/ui/utils";

import tag from "../icons/tag";
import { dataUriFromPath } from "../styles/utils";

export const sticker = (color?: string): StyleFn => (t) => ({
  "&:before": {
    content: `url(${dataUriFromPath({
      fill: color ?? t.color.text.dark.base,
      path: tag,
    })})`,
    display: "inline-block",
    marginRight: "0.5em",
    marginTop: "-0.15em",
    ...size("1em"),
    verticalAlign: "middle",
  },
  fontWeight: t.font.primary.weight.medium,
});

const Discount: FC<ComponentStyleProps> = ({ _css = {}, children }) => (
  <span
    css={s(
      sticker(),
      {
        whiteSpace: "nowrap",
      },
      _css
    )}
  >
    {children}
  </span>
);

export default Discount;
