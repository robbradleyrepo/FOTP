import React, { createContext, forwardRef, PropsWithChildren } from "react";

import { ComponentStyleProps, negate, s, useTheme } from "@/common/ui/utils";

import { ResponsiveCSSValue } from "../../styles/helpers";
import { ThemeEnhanced } from "../../styles/theme";

type StyleValueFn = (theme: ThemeEnhanced) => ResponsiveCSSValue;

const useThemedCSSValue = () => {
  const theme = useTheme();

  return (value: ResponsiveCSSValue | StyleValueFn): ResponsiveCSSValue =>
    typeof value === "function" ? value(theme) : value;
};

interface GridContextProps {
  gx?: ResponsiveCSSValue;
  gy?: ResponsiveCSSValue;
  itemWidth?: ResponsiveCSSValue | StyleValueFn;
}

const GridContext = createContext<GridContextProps>({});

interface ItemProps extends ComponentStyleProps {
  width?: ResponsiveCSSValue | StyleValueFn;
}

export const Item = forwardRef<HTMLLIElement, PropsWithChildren<ItemProps>>(
  function Item({ _css = {}, children, width }, ref) {
    const themedCSSValue = useThemedCSSValue();

    return (
      <GridContext.Consumer>
        {({ gx, gy, itemWidth }) => (
          <li
            css={s(_css, {
              paddingLeft: gx,
              paddingTop: gy,
              width: themedCSSValue(
                typeof width === "undefined" ? itemWidth : width
              ),
            })}
            ref={ref}
          >
            {children}
          </li>
        )}
      </GridContext.Consumer>
    );
  }
);

export type GridAlignment = "center" | "left" | "right";
export type GridDirection = "ltr" | "rtl";

export interface GridProps extends ComponentStyleProps {
  align?: GridAlignment;
  direction?: GridDirection;
  gx?: ResponsiveCSSValue | StyleValueFn;
  gy?: ResponsiveCSSValue | StyleValueFn;
  innerCss?: ComponentStyleProps["_css"];
  itemWidth?: ResponsiveCSSValue | StyleValueFn;
}

export const Grid = forwardRef<HTMLDivElement, PropsWithChildren<GridProps>>(
  function Grid(
    {
      _css = {},
      align = "left",
      children,
      direction = "ltr",
      gx: _gx,
      gy: _gy,
      innerCss = {},
      itemWidth,
    },
    ref
  ) {
    const themedCSSValue = useThemedCSSValue();

    const gx = themedCSSValue(_gx);
    const gy = themedCSSValue(_gy);

    const negativeGx = Array.isArray(gx) ? gx.map(negate) : negate(gx);
    const negativeGy = Array.isArray(gy) ? gy.map(negate) : negate(gy);

    const justification = {
      center: "center",
      left: direction === "ltr" ? "flex-start" : "flex-end",
      right: direction === "ltr" ? "flex-end" : "flex-start",
    };

    return (
      <GridContext.Provider value={{ gx, gy, itemWidth }}>
        <div ref={ref} css={s(_css)}>
          <ul
            css={s(
              {
                alignItems: "stretch",
                display: "flex",
                flexDirection: direction === "ltr" ? "row" : "row-reverse",
                flexWrap: "wrap",
                justifyContent: justification[align],
              },
              innerCss,
              {
                marginLeft: negativeGx,
                marginTop: negativeGy,
              }
            )}
          >
            {children}
          </ul>
        </div>
      </GridContext.Provider>
    );
  }
);
