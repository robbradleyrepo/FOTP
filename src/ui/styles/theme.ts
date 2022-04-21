import { EnhancedTheme } from "@/common/ui/utils";

import { breakpoint, color, font, height, radius, spacing } from "./variables";

export const theme = {
  breakpoint,
  color,
  font,
  height,
  radius,
  spacing,
};

export type Theme = typeof theme;

export type ThemeEnhanced = EnhancedTheme<Theme>;
