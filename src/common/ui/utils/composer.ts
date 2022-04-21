import { evaluate, merge } from "./common";
import {
  IsomorphicStyleFn,
  ResponsiveCSSObject,
  Style,
  ThemedProps,
  ThemeEnhanced,
} from "./types";

const flatten = (args: Style[], theme: ThemeEnhanced): ResponsiveCSSObject =>
  args.reduce<ResponsiveCSSObject>(
    (acc, style) => merge(acc, evaluate(style, theme)),
    {}
  );

const isTheme = (arg: ThemeEnhanced | ThemedProps): arg is ThemedProps =>
  !!(arg.theme && Object.keys(arg.theme).length > 0);

export const s = (...styles: Style[]): IsomorphicStyleFn => (
  arg: ThemeEnhanced | ThemedProps
): any =>
  isTheme(arg)
    ? arg.theme.dynamicStyleFn(flatten(styles, arg.theme))
    : flatten(styles, arg);
