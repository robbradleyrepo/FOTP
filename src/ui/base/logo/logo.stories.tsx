import { Link } from "@sss/next";
import React from "react";

import { s } from "@/common/ui/utils";

import Logo from ".";

export default {
  title: "Elements/Logo",
};

export const Default = () => (
  <Logo
    _css={s({
      height: [48, null, 60],
      width: "auto",
    })}
    fill="currentColor"
  />
);

export const WithLink = () => (
  <Link prefetch={false} to="/">
    <Logo
      _css={s({
        height: [48, null, 60],
        width: "auto",
      })}
      fill="currentColor"
    />
  </Link>
);
