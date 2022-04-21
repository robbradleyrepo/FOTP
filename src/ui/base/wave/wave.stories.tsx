import React from "react";

import { greedy, gutter, percentage, s } from "@/common/ui/utils";

import { wave } from ".";

export default {
  title: "Styles/Wave",
};

export const Wave = () => (
  <header
    css={s(gutter, (t) => ({
      "&:after, &:before": {
        ...greedy,
        content: "''",
        display: "block",
        height: null,
        position: "absolute",
        top: null,
        zIndex: -1,
      },
      // eslint-disable-next-line sort-keys
      "&:after": {
        backgroundColor: t.color.background.feature1,
        top: [percentage(3 / 4), null, percentage(1 / 2)],
      },
      "&:before": {
        ...wave({ color: t.color.background.feature1 }),
        bottom: [percentage(1 / 4), null, percentage(1 / 2)],
      },
      paddingTop: t.spacing.xl,
      position: "relative",
    }))}
  >
    like a totally rad break, dude
  </header>
);
