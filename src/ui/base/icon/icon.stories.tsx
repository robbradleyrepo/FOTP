import React from "react";

import { s } from "@/common/ui/utils";

import biodegradable from "../../icons/biodegradable";
import Icon from ".";

export default {
  title: "Styles/Icons",
};

export const Icons = () => (
  <Icon
    _css={s((t) => ({
      color: t.color.tint.grass,
      marginTop: t.spacing.md,
      width: 60,
    }))}
    path={biodegradable}
    title="biodegradable"
    viewBox="0 0 32 32"
  />
);
