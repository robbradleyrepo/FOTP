import React from "react";
import { height } from "src/ui/styles/variables";

import { belt, px, ResponsiveCSSValue, s } from "@/common/ui/utils";

import banner from ".";

export default {
  title: "Components/Banner",
};

const hasBanner = true;

const headerHeights: ResponsiveCSSValue = [
  height.nav.mobile + (hasBanner ? height.banner.mobile : 0),
  null,
  height.nav.desktop + (hasBanner ? height.banner.desktop : 0),
];

export const Default = () => (
  <>
    {hasBanner && <div css={s(banner)}>Banner</div>}
    <main>
      <header
        css={s(belt, (t) => ({
          backgroundColor: "#CDD5CC",
          color: t.color.text.dark.base,
          height: ["auto", null, "100vh"],
          marginTop: headerHeights,
          maxHeight: ["none", null, 760, 800],
          paddingBottom: t.spacing.xxl,
          paddingTop: [t.spacing.lg, t.spacing.xl, t.spacing.xxl],
          ...px([0, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
          position: "relative",
        }))}
      >
        Header
      </header>
    </main>
  </>
);
