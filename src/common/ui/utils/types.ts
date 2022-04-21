import * as CSS from "csstype";
import { DynamicStyleFunction } from "facepaint";
import { CSSObject, FlattenInterpolation } from "styled-components";

import { theme } from "../../../../src/ui/styles/theme";

export type CSSValue = string | number | null | undefined;
export type ResponsiveCSSValue = CSSValue | CSSValue[];

export type ResponsiveCSSProperties = {
  [K in keyof CSS.Properties]?: ResponsiveCSSValue;
};
export type ResponsiveCSSPseudos = { [K in CSS.Pseudos]?: ResponsiveCSSObject };

export interface ResponsiveCSSObject
  extends ResponsiveCSSProperties,
    ResponsiveCSSPseudos {
  [k: string]: ResponsiveCSSObjectOrValue;
}

export type ResponsiveCSSObjectOrValue =
  | ResponsiveCSSObject
  | ResponsiveCSSValue;

export type Theme = typeof theme & { theme?: never };

export type ThemeEnhanced = EnhancedTheme<Theme>;

export type EnhancedTheme<T extends Theme> = T & {
  dynamicStyleFn: DynamicStyleFunction;
  styles: Record<string, any>;
};

export interface ComponentStyleProps {
  _css?: Style;
  css?: never;
}

export type ThemedProps = Record<"theme", ThemeEnhanced>;

export type StyleFn = (theme: ThemeEnhanced) => ResponsiveCSSObject;

export type IsomorphicStyleFn = StyleFn & {
  (theme: ThemeEnhanced): ResponsiveCSSObject;
};

export type Style = StyleFn | ResponsiveCSSObject;

declare module "react" {
  interface Attributes {
    css?:
      | string
      | CSSObject
      | FlattenInterpolation<ThemeEnhanced>
      | IsomorphicStyleFn;
  }
}
