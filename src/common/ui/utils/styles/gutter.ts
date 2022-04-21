import { s } from "../composer";
import { StyleFn, Theme } from "../types";

export const gutterSpacingX = (t: Theme) => [
  t.spacing.md,
  null,
  t.spacing.lg,
  t.spacing.xl,
  t.spacing.xxl,
];

export const gutterSpacingY = (t: Theme) => [
  t.spacing.xxl,
  null,
  96,
  t.spacing.xxxl,
];

export const gutterBottom: StyleFn = (t) => ({
  paddingBottom: gutterSpacingY(t),
});

export const gutterLeft: StyleFn = (t) => ({
  paddingLeft: gutterSpacingX(t),
});
export const gutterRight: StyleFn = (t) => ({
  paddingRight: gutterSpacingX(t),
});
export const gutterTop: StyleFn = (t) => ({
  paddingTop: gutterSpacingY(t),
});

export const gutterX = s(gutterLeft, gutterRight);

export const gutterY = s(gutterBottom, gutterTop);

export const gutter = s(gutterX, gutterY);
