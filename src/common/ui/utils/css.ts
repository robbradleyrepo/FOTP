import { CSSValue, ResponsiveCSSObject, ResponsiveCSSValue } from "./types";

export const mx = (value: ResponsiveCSSValue): ResponsiveCSSObject => ({
  marginLeft: value,
  marginRight: value,
});

export const my = (value: ResponsiveCSSValue): ResponsiveCSSObject => ({
  marginBottom: value,
  marginTop: value,
});

export const negate = (value: CSSValue) => {
  if (typeof value === "string") {
    return `-${value}`;
  } else if (typeof value === "number") {
    return -value;
  }

  return value;
};

export const percentage = (value: number) => value * 100 + "%";

export const px = (value: ResponsiveCSSValue): ResponsiveCSSObject => ({
  paddingLeft: value,
  paddingRight: value,
});
export const py = (value: ResponsiveCSSValue): ResponsiveCSSObject => ({
  paddingBottom: value,
  paddingTop: value,
});

export const size = (value: ResponsiveCSSValue): ResponsiveCSSObject => ({
  height: value,
  width: value,
});
