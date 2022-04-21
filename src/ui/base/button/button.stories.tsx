import React from "react";

import { s } from "@/common/ui/utils";

import {
  baseButton,
  contrastButton,
  primaryButton,
  secondaryButton,
  textButton,
} from "./index";

export default {
  title: "Elements/Button",
};

export const AllButtons = () => (
  <div
    css={s({
      button: {
        marginRight: "1rem",
      },
    })}
  >
    <button css={s(baseButton())}>Base</button>
    <button css={s(contrastButton())}>Contrast</button>
    <button css={s(primaryButton())}>Primary</button>
    <button css={s(secondaryButton())}>Secondary</button>
    <button css={s(textButton())}>Text</button>
  </div>
);

export const Base = () => <button css={s(baseButton())}>Base</button>;

export const Contrast = () => (
  <button css={s(contrastButton())}>Contrast</button>
);

export const Primary = () => <button css={s(primaryButton())}>Primary</button>;

export const Secondary = () => (
  <button css={s(secondaryButton())}>Secondary</button>
);

export const Text = () => <button css={s(textButton())}>Text</button>;
