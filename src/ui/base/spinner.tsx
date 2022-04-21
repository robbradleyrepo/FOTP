import React, { FC } from "react";
import styled from "styled-components";

import {
  ComponentStyleProps,
  greedy,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

const Spin = styled.div`
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner: FC<ComponentStyleProps> = ({ _css = {} }) => (
  <div
    css={s(greedy, {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    })}
  >
    <Spin
      css={s(
        (t) => ({
          ...size(t.spacing.md),
          "&:after": {
            ...size("100%"),
            borderRadius: "50%",
          },
          animation: "load 600ms infinite linear",
          borderColor: "rgba(24, 83, 65, 0.1)",
          borderLeftColor: "currentColor",
          borderRadius: "50%",
          borderStyle: "solid",
          borderWidth: 3,
          transform: "translateZ(0)",
        }),
        _css
      )}
    />
  </div>
);

interface PageSpinnerProps extends ComponentStyleProps {
  label: string;
}

export const PageSpinner: FC<PageSpinnerProps> = ({ _css = {}, label }) => (
  <main aria-busy css={s(_css)}>
    <div role="alert">
      <p css={s(visuallyHidden)}>{label}</p>
      <Spinner _css={s((t) => size(t.spacing.xxl))} />
    </div>
  </main>
);

export default Spinner;
