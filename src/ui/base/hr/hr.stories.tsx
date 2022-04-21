import React from "react";

import { s } from "@/common/ui/utils";
import { gutter } from "@/common/ui/utils";

import horizontalRule from ".";

export default {
  title: "Styles/Rule",
};

export const Rule = () => (
  <div css={s(gutter)}>
    <div css={s(horizontalRule)}>dogs rule!</div>
  </div>
);
