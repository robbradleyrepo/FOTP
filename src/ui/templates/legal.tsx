import React, { FC, ReactNode } from "react";
import styled from "styled-components";

import { belt, gutter, s } from "@/common/ui/utils";

import { headingAlpha } from "../base/typography";
import { font, spacing } from "../styles/variables";
import Standard from "./standard";

const Body = styled("div")`
  & > .meta:first-child {
    margin-bottom: ${spacing.xxl}px;
    text-align: center;
  }

  a {
    font-weight: ${font.primary.weight.medium};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  b,
  strong {
    font-weight: ${font.primary.weight.medium};
  }

  h2,
  h3 {
    font-weight: ${font.primary.weight.medium};
    margin-bottom: ${spacing.sm}px;
    margin-top: ${spacing.xxl}px;
  }

  ol,
  p,
  ul {
    margin-bottom: ${spacing.sm}px;
  }

  ol,
  ul {
    list-style: initial;
    padding-left: 2em;
  }
`;

interface LegalProps {
  body?: string;
  title: ReactNode;
}

export const Legal: FC<LegalProps> = ({ children, body, title }) => (
  <Standard gorgiasDelay={false}>
    <main css={s(gutter)}>
      <div css={s(belt, { maxWidth: 820 })}>
        <h1
          css={s(headingAlpha, (t) => ({
            marginBottom: t.spacing.sm,
            textAlign: "center",
          }))}
        >
          {title}
        </h1>
        {children}
        {body && <Body dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    </main>
  </Standard>
);

export default Legal;
