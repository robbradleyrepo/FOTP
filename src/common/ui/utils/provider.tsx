import React, { FC, useMemo } from "react";
import {
  ThemeProvider as SCThemeProvider,
  useTheme as useSCTheme,
} from "styled-components";

import { getDynamicStyleFn } from "./helpers";
import * as styles from "./styles";
import { Theme, ThemeEnhanced } from "./types";

interface ThemeProviderProps {
  theme: Theme;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, theme }) => {
  const themeEnhanced: Theme = useMemo(() => {
    const dynamicStyleFn = getDynamicStyleFn(theme);

    return { ...theme, dynamicStyleFn, styles };
  }, [theme]);

  return <SCThemeProvider theme={themeEnhanced}>{children}</SCThemeProvider>;
};

export const useTheme = () => useSCTheme() as ThemeEnhanced;
