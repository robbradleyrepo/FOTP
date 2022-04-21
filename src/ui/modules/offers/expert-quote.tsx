import React, { FC, ReactNode } from "react";
import ResponsiveImage from "src/ui/base/responsive-image";

import { s } from "@/common/ui/utils";

import COMMON_EXPERTS_SCOTT_MILLER_IMG from "../../assets/images/common/experts/SCOTT_MILLER.jpg";
import { bodyText, headingCharlie } from "../../base/typography";

interface ExpertQuoteProps {
  name: ReactNode;
  quote: ReactNode;
}

const ExpertQuote: FC<ExpertQuoteProps> = ({ quote, name }) => (
  <div
    css={s((t) => ({
      alignItems: ["flex-start", null, null, "center"],
      borderBottomColor: [t.color.border.light, null, null, "transparent"],
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      display: ["flex", null, null, "block"],
      mb: [30, null, t.spacing.xl],
      paddingBottom: [t.spacing.lg, null, t.spacing.xl],
      textAlign: ["left", null, null, "center"],
    }))}
  >
    <div
      css={s({
        margin: "auto",
        maxWidth: [90, null, 100, 120, 200],
        width: "100%",
      })}
    >
      <ResponsiveImage
        _css={s((t) => ({
          borderRadius: t.radius.xxl,
        }))}
        alt=""
        priority
        sizes={{ width: 240 }}
        src={COMMON_EXPERTS_SCOTT_MILLER_IMG}
      />
    </div>
    <div
      css={s((t) => ({
        paddingLeft: [t.spacing.sm, t.spacing.md, t.spacing.lg, t.spacing.xl],
      }))}
    >
      <p
        css={s(headingCharlie, (t) => ({
          fontSize: [20, 22, 28],
          fontStyle: "italic",
          fontWeight: t.font.secondary.weight.book,
          lineHeight: ["24px", "28px", "32px"],
          marginBottom: [t.spacing.xxs, null, null, t.spacing.sm],
        }))}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <p css={s(bodyText, { fontSize: [14, 16, 18] })}>– {name}</p>
    </div>
  </div>
);

export default ExpertQuote;
