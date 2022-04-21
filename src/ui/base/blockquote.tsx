import React, { FC, ReactNode } from "react";

import { belt, ComponentStyleProps, px, s } from "@/common/ui/utils";

import { bodyText, headingAlpha, headingCharlie } from "./typography";

interface BlockquoteProps extends ComponentStyleProps {
  attribution?: ReactNode;
  ornament?: ReactNode;
}

const Blockquote: FC<BlockquoteProps> = ({
  _css = {},
  attribution,
  children,
  ornament,
}) => (
  <figure
    css={s(
      belt,
      (t) => ({
        borderColor: t.color.background.feature3,
        borderStyle: "solid",
        borderWidth: 4,
        ...px([t.spacing.sm, t.spacing.lg, t.spacing.xl]),
        paddingBottom: t.spacing.lg,
        paddingTop: [t.spacing.sm, t.spacing.md, t.spacing.lg],
        textAlign: "center",
      }),
      _css
    )}
  >
    <span
      css={s((t) =>
        ornament
          ? {}
          : {
              "&:before": {
                ...headingAlpha(t),
                color: t.color.background.feature5,
                content: "'“'",
                display: "block",
                fontSize: [80, null, 96],
                lineHeight: 0.75,
                marginBottom: "-0.25em",
              },
            }
      )}
      role="presentation"
    >
      {ornament}
    </span>
    <blockquote
      css={s(belt, headingCharlie, {
        "&:after": { content: "'”'" },
        "&:before": { content: "'“'" },
        fontSize: [20, null, 28],
        maxWidth: 640,
      })}
    >
      {children}
    </blockquote>
    {attribution && (
      <figcaption
        css={s(bodyText, (t) => ({
          "& > strong": { fontWeight: t.font.primary.weight.medium },
          marginTop: t.spacing.md,
        }))}
      >
        &ndash; {attribution}
      </figcaption>
    )}
  </figure>
);

export default Blockquote;
