import { captureException } from "@sentry/nextjs";
import * as CSS from "csstype";
import facepaint, { DynamicStyleFunction } from "facepaint";
import { getContrast } from "polished";

import { evaluate, isObject } from "./common";
import { useTheme } from "./provider";
import {
  CSSValue,
  ResponsiveCSSObject,
  ResponsiveCSSObjectOrValue,
  ResponsiveCSSValue,
  Style,
  StyleFn,
  Theme,
} from "./types";

const getBreakpoints = ({ breakpoint }: Theme) => [
  breakpoint.sm,
  breakpoint.md,
  breakpoint.lg,
  breakpoint.xl,
];

export const getDynamicStyleFn = (theme: Theme): DynamicStyleFunction => {
  const breakpoints = getBreakpoints(theme);

  return facepaint(
    breakpoints.map((minWidth) => `@media(min-width:${minWidth}px)`)
  );
};

export const getMostContrasting = (reference: string, options: string[]) =>
  options
    .sort((a, b) => getContrast(reference, a) - getContrast(reference, b))
    .pop();

export const unresponsiveFactory = (
  properties: (keyof CSS.Properties)[] = []
) => {
  const unresponsiveProperties = new Set<string>(properties);

  const unresponsive = (style: ResponsiveCSSObject): ResponsiveCSSObject =>
    Object.entries(style).reduce((accum, [key, value]) => {
      let result: ResponsiveCSSObjectOrValue = value;

      if (Array.isArray(result)) {
        if (unresponsiveProperties.has(key)) {
          result = result[0];
        }
      } else if (isObject(result)) {
        result = unresponsive(result);
      }

      return { ...accum, [key]: result };
    }, {});

  return (style: Style): StyleFn => (t) => unresponsive(evaluate(style, t));
};

export const unresponsiveTypography = unresponsiveFactory([
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
]);

export const useContrastingBackground = (color: string) => {
  const theme = useTheme();

  return getMostContrasting(color, Object.values(theme.color.background));
};

export const useContrastingText = (color: string) => {
  const theme = useTheme();

  return getMostContrasting(color, [
    theme.color.text.light.base,
    theme.color.text.dark.base,
  ]);
};

export const getValueAtBreakpoint = (
  responsiveValues: ResponsiveCSSValue,
  index: number
) => {
  if (!Array.isArray(responsiveValues)) {
    return responsiveValues;
  }

  // Use the same mapping as `facepaint` for consistency with our styling
  // system: ignore `null` or `undefined` values, and fallback to the last
  // valid value
  for (let i = index; i >= 0; i -= 1) {
    const value = responsiveValues[i];

    if (value !== null && value !== undefined) {
      return value;
    }
  }

  return null;
};

interface Width {
  unit: "px" | "viewport";
  value: number;
}

const toFloat = (value: string) => {
  const result = parseFloat(value);

  if (isNaN(result)) {
    throw new Error(`Could not convert string "${value}" into float`);
  }

  return result;
};

// The `sizes` attribute only accepts whole pixels
const toPx = (value: number) => `${Math.round(value)}px`;

const parseWidth = (cssValue: CSSValue): Width | null => {
  if (typeof cssValue === "number") {
    return {
      unit: "px",
      value: cssValue,
    };
  } else if (typeof cssValue === "string") {
    if (cssValue.endsWith("vw")) {
      return {
        unit: "viewport",
        value: toFloat(cssValue) / 100,
      };
    } else if (cssValue.endsWith("px")) {
      return {
        unit: "px",
        value: toFloat(cssValue),
      };
    } else if (cssValue.match(/^\d+\D+$/)) {
      const error = new Error(
        `Invalid length unit used in "${cssValue}": expected "px" or "vw"`
      );

      if (process.env.NODE_ENV === "production") {
        captureException(error);
      } else {
        throw error;
      }
    }
  }

  return null;
};

export interface ResponsiveImageProperties {
  // Note that these are the values applied to the image in the layout, not the
  // image's intrinsic dimensions or max-width of its containing element.
  // For example, consider the following layout:
  //
  // <div css={s({ maxWidth: 960 })>
  //   <img css={s({ width: "50%" })} />
  // </div>
  //
  // The image occupies 50% of its parent element, so its
  // `ResponsiveImageProperties` would be `{ maxWidth: 480, width: "50vw" }`
  maxWidth?: ResponsiveCSSValue;
  width?: ResponsiveCSSValue;
}

export const useResponsiveImageSizes = () => {
  const theme = useTheme();

  const breakpoints = getBreakpoints(theme);

  return (properties: ResponsiveImageProperties) => {
    const sizes = [null, ...breakpoints].reduce<
      {
        breakpoint: number | null;
        size: string;
      }[]
    >((accum, breakpoint, index, arr) => {
      const nextBreakpoint = arr[index + 1];
      const maxWidth = parseWidth(
        getValueAtBreakpoint(properties.maxWidth, index)
      );
      const width = parseWidth(getValueAtBreakpoint(properties.width, index));

      let sizes = accum;

      let maxViewportWidth = 1; // Default to 100vw
      let maxPixelWidth: number | null = null;

      if (maxWidth?.unit === "px") {
        maxPixelWidth = maxWidth.value;
      } else if (maxWidth?.unit === "viewport") {
        maxViewportWidth = maxWidth.value;
      }

      if (
        width?.unit === "px" &&
        (maxPixelWidth === null || maxPixelWidth > width.value)
      ) {
        maxPixelWidth = width.value;
      } else if (width?.unit === "viewport" && maxViewportWidth > width.value) {
        maxViewportWidth = width.value;
      }

      // If the image has a maximum pixel value, let's check to see if it has
      // already taken effect, or if it takes effect within this breakpoint
      if (maxPixelWidth) {
        // The viewport width (in pixels) at which the maximum width is reached
        const viewportWidth = maxPixelWidth / maxViewportWidth;

        if (breakpoint && viewportWidth < breakpoint) {
          sizes = [
            ...sizes,
            {
              breakpoint,
              size: toPx(maxPixelWidth),
            },
          ];
        } else {
          sizes = [
            ...sizes,
            {
              breakpoint,
              size: `${maxViewportWidth * 100}vw`,
            },
          ];

          if (!nextBreakpoint || viewportWidth < nextBreakpoint) {
            sizes = [
              ...sizes,
              {
                breakpoint: viewportWidth,
                size: toPx(maxPixelWidth),
              },
            ];
          }
        }
      } else {
        sizes = [
          ...sizes,
          {
            breakpoint,
            size: `${maxViewportWidth * 100}vw`,
          },
        ];
      }

      return sizes;
    }, []);

    return sizes.reduce((accum, { breakpoint, size }, index, arr) => {
      const lastSize = arr[index - 1];

      let str = accum;

      if (lastSize?.size !== size) {
        str = breakpoint ? `(min-width:${breakpoint}px) ${size}, ${str}` : size;
      }

      return str;
    }, "");
  };
};
