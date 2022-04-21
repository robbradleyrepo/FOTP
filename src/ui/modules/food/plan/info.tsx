import React, { FC } from "react";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import EXPERT_JAMIE_IMG from "../../../../assets/images/common/experts/JAMIE.jpg";
import ResponsiveImage from "../../../base/responsive-image";

const FoodPlanInfo: FC<ComponentStyleProps> = ({ _css = {}, children }) => (
  <div
    css={s(
      (t) => ({
        alignItems: "flex-start",
        background: t.color.background.feature1,
        borderRadius: t.radius.sm,
        display: "flex",
        justifyContent: "stretch",
        padding: [t.spacing.sm, null, t.spacing.lg],
        textAlign: "left",
        width: "100%",
      }),
      _css
    )}
    role="note"
  >
    <div
      css={s((t) => ({
        flexGrow: 0,
        flexShrink: 0,
        marginRight: [t.spacing.xs, null, t.spacing.sm],
        ...size([36, null, 48]),
      }))}
    >
      <ResponsiveImage
        {...EXPERT_JAMIE_IMG}
        _css={s((t) => ({ borderRadius: t.radius.xxl }))}
        alt=""
        sizes={{ width: [36, null, 48] }}
      />
    </div>
    <div css={s({ flexGrow: 1, flexShrink: 1 })}>{children}</div>
  </div>
);

export default FoodPlanInfo;
