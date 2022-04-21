import React from "react";

import { s } from "@/common/ui/utils";

import { bodyTextStatic } from "../typography";
import { squiggleX, squiggleY } from ".";

export default {
  title: "Styles/Squiggles",
};

export const SquiggleX = () => (
  <section
    css={s((t) => ({
      "&:before": {
        ...squiggleX({ color: t.color.background.feature5 }),
        content: "''",
        display: "inline-block",
        marginBottom: t.spacing.lg,
      },
    }))}
  >
    <p css={s(bodyTextStatic)}>There is a squiggle above me</p>
  </section>
);

export const SquiggleY = () => (
  <section
    css={s((t) => ({
      "&:before": {
        ...squiggleY({ color: t.color.background.feature5 }),
        content: "''",
        display: "inline-block",
        marginBottom: t.spacing.lg,
      },
      maxWidth: 400,
    }))}
  >
    <p css={s(bodyTextStatic)}>There is a squiggle above me</p>
  </section>
);
