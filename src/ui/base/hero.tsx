import { captureException } from "@sentry/nextjs";
import { useInView } from "@sss/hooks";
import Head from "next/head";
import React, { FC, Fragment, useRef } from "react";

import { isDefined } from "@/common/filters";
import {
  ComponentStyleProps,
  getValueAtBreakpoint,
  s,
  useTheme,
} from "@/common/ui/utils";

import { deviceSizes, getNextImageUrl } from "./responsive-image";

type HeroProps = ComponentStyleProps & {
  quality?: number;
} & (
    | { priority?: false; urls: [string, ...Array<string | null>] } // Responsive images with "art direction" (eg different images at different breakpoints)
    | { priority: true; urls: Array<string | null> } // A priority image that doesn't display on small screens
  );

interface ImageData {
  media: Record<"max" | "min", number | null>;
  url: string;
}

const Hero: FC<HeroProps> = ({ _css = {}, urls, priority, quality }) => {
  const hasWarnedOnInvalidUseRef = useRef(false);
  const theme = useTheme();

  const breakpoints = [
    theme.breakpoint.sm,
    theme.breakpoint.md,
    theme.breakpoint.lg,
    theme.breakpoint.xl,
  ];

  const [ref, isInView] = useInView({ rootMargin: "50%", triggerOnce: true });
  const shouldDisplay = priority || isInView;

  const data = !shouldDisplay
    ? null
    : breakpoints.reduceRight<ImageData[]>((accum, _breakpoint, index) => {
        const url = getValueAtBreakpoint(urls, index) as string | null;
        if (!url) {
          return accum;
        }

        let max: number | null = null;

        const prev = accum[accum.length - 1] ?? null;

        if (prev?.media.min) {
          max = prev.media.min - 1;
        }

        return [
          ...accum,
          {
            media: { max, min: breakpoints[index - 1] ?? null },
            url: getNextImageUrl({
              quality,
              src: url,
              width:
                deviceSizes.find((width) => !!max && max * 1.5 < width) ??
                deviceSizes[deviceSizes.length - 1],
            }),
          },
        ];
      }, []);

  let fallbackUrl =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // Browsers will download the fallback image if there isn't a matching
  // `source` for the current media query. As such, we'll need to avoid using
  // a hi-res fallback if we don't have images for all media queries.
  if (urls[0] !== null && data?.[0].url) {
    fallbackUrl = data[0].url;
  }

  // We can use TypeScript to make sure that only priority images can
  // have a `null` value for their first URL, but we'll need to use
  // a runtime check to make sure that we're using multiple URLs for
  // non-priority images
  if (
    !hasWarnedOnInvalidUseRef.current &&
    !priority &&
    urls.filter((url) => typeof url === "string").length < 2
  ) {
    const error = new Error(
      "`Hero` should only be used for displaying different images at different breakpoints. Use `ResponsiveImage` if you only have a single image."
    );

    if (process.env.NODE_ENV === "production") {
      captureException(error);
      hasWarnedOnInvalidUseRef.current = true;
    } else {
      throw error;
    }
  }

  return (
    <picture css={s(_css)} ref={ref}>
      {data?.map(({ media, url }, index) => {
        const maxQuery =
          media.max !== null ? `(max-width: ${media.max}px)` : undefined;
        const minQuery =
          media.min !== null ? `(min-width: ${media.min}px)` : undefined;

        const queryFragments = [minQuery, maxQuery].filter(isDefined);
        const preloadQuery =
          queryFragments.length > 0 ? queryFragments.join(" and ") : undefined;

        return (
          <Fragment key={index}>
            {priority && (
              <Head>
                <link
                  as="image"
                  href={url}
                  media={preloadQuery}
                  rel="preload"
                />
              </Head>
            )}
            <source srcSet={url} media={minQuery} />
          </Fragment>
        );
      })}
      <img alt="" src={fallbackUrl} />
    </picture>
  );
};

export default Hero;
