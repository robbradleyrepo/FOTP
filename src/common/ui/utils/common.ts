import {
  ResponsiveCSSObject,
  ResponsiveCSSObjectOrValue,
  Style,
  ThemeEnhanced,
} from "./types";

export const evaluate = (
  style: Style,
  theme: ThemeEnhanced
): ResponsiveCSSObject => (typeof style === "function" ? style(theme) : style);

export const isObject = (
  target: ResponsiveCSSObjectOrValue
): target is ResponsiveCSSObject =>
  Object.prototype.toString.call(target) === "[object Object]";

export const merge = (
  accum: ResponsiveCSSObject,
  ...inputs: ResponsiveCSSObject[]
): ResponsiveCSSObject => {
  if (!inputs.length) return accum;

  const input = inputs.shift();
  let output = accum;

  for (const key in input) {
    const left = accum[key];
    const right = input[key];

    output = {
      ...output,
      [key]: isObject(left) && isObject(right) ? merge(left, right) : right,
    };
  }

  return merge(output, ...inputs);
};
