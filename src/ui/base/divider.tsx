import React, { FC } from "react";

import { ComponentStyleProps, px, s } from "@/common/ui/utils";

import { bodyTextExtraSmall } from "./typography";

const Divider: FC<ComponentStyleProps> = ({ _css = {}, children }) => (
  <div
    css={s(
      bodyTextExtraSmall,
      (t) => ({
        "&:before, &:after": {
          borderTopColor: t.color.border.light,
          borderTopStyle: "solid",
          borderTopWidth: 1,
          content: '""',
          display: "block",
          flexGrow: 1,
        },
        alignItems: "center",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "stretch",
        width: "100%",
      }),
      _css
    )}
  >
    <span
      css={s((t) => ({
        ...px(t.spacing.xs),
        flexGrow: 0,
        flexShrink: 0,
        maxWidth: "90%",
      }))}
    >
      {children}
    </span>
  </div>
);

export default Divider;
