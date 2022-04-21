import React, { createContext, FC, useContext } from "react";

import {
  IsomorphicStyleFn,
  ResponsiveCSSObject,
  StyleFn,
} from "@/common/ui/utils";

export type CmsLayoutMaxWidth = Record<
  "primary" | "secondary",
  number | (number | null)[]
>;

export type CmsLayoutStyles = Record<
  "belt" | "gutterX" | "mb" | "paddingX",
  IsomorphicStyleFn | ResponsiveCSSObject | StyleFn
>;

interface CmsLayoutContextProps {
  maxWidth: CmsLayoutMaxWidth;
  styles: CmsLayoutStyles;
}

const CmsLayoutContext = createContext<CmsLayoutContextProps | null>(null);

export const CmsLayoutProvider: FC<CmsLayoutContextProps> = ({
  children,
  ...value
}) => (
  <CmsLayoutContext.Provider value={value}>
    {children}
  </CmsLayoutContext.Provider>
);

export const useCmsLayout = () => {
  const context = useContext(CmsLayoutContext);

  if (!context) {
    throw new Error(
      "`useCmsLayout` can only be used inside a `CmsLayoutProvider`"
    );
  }

  return context;
};
