import facepaint from "facepaint";
import { useEffect, useState } from "react";

import { breakpoint } from "../variables";

const breakpoints = [
  breakpoint.sm,
  breakpoint.md,
  breakpoint.lg,
  breakpoint.xl,
];

const mediaQueries = breakpoints.map(
  (minWidth) => `(min-width: ${minWidth}px)`
);

const mq = facepaint(mediaQueries.map((query) => `@media${query}`));

// WARNING: values returned by `useMedia` will not be consistent between
// server and client. Do not use these values anywhere that will affect
// the initial render.
const useMedia = <T>(values: T[]): T => {
  const [defaultValue, ...responsiveValues] = values;

  const mediaQueryLists =
    typeof window !== "undefined"
      ? mediaQueries.map((query) => window.matchMedia(query)) // Reverse the index so we check that largest break points first
      : [];

  const getValue = () => {
    let index = -1;

    // Find the last matching condition, as all our queries are mobile first
    for (let i = 0; i < mediaQueryLists.length; i += 1) {
      const mediaQueryList = mediaQueryLists[i];

      if (mediaQueryList.matches) {
        index = i;
      }
    }

    let value = defaultValue;

    // Use the same mapping as `facepaint` for consistency with our styling
    // system: ignore boolean, `null` or `undefined` values, and fallback to
    // the last valid value
    for (let i = 0; i <= index; i += 1) {
      const currentValue = responsiveValues[i];

      if (
        typeof currentValue !== "boolean" &&
        currentValue !== null &&
        currentValue !== undefined
      ) {
        value = currentValue;
      }
    }

    return value;
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);

    mediaQueryLists.forEach((mql) => mql.addListener(handler));

    return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
  }, []);

  return value;
};

export { mq, useMedia };
