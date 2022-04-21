import { captureException } from "@sentry/nextjs";
import { getLegacyId } from "@sss/ecommerce/common";
import { getProductUrl, ProductCore } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import Script from "next/script";
import React, { FC, useEffect, useState } from "react";

import {
  ComponentStyleProps,
  ResponsiveCSSObject,
  s,
  useTheme,
} from "@/common/ui/utils";

import { headingBravo } from "../../base/typography";
import { ThemeEnhanced } from "../../styles/theme";
import LazyLoading from "../lazy-loading";

const config =
  process.env.STAMPED_API_KEY && process.env.STAMPED_STORE_URL
    ? {
        apiKey: process.env.STAMPED_API_KEY,
        storeUrl: process.env.STAMPED_STORE_URL,
      }
    : null;

const useCustomScaleCss = () => {
  const theme = useTheme();

  return (
    attributeName: string,
    _css?: ResponsiveCSSObject
  ): ResponsiveCSSObject => {
    const itemWidth = 24;
    const gutter = 2;

    const height = 8;
    const width = itemWidth * 5 + gutter * 4;

    const getContentUri = (value: number) => {
      let polygons = "";

      for (let i = 0; i < 5; i++) {
        const x1 = i * (itemWidth + gutter);
        const x2 = x1 + itemWidth;
        const y1 = 0;
        const y2 = height;

        polygons += `<polygon ${
          Math.round(value) > i ? "" : ' class="disabled"'
        } shape-rendering="crispEdges" points="${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}" />`;
      }

      return `data:image/svg+xml;charset=utf8,${encodeURIComponent(`<svg fill="${theme.color.state.success}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><style>.disabled { opacity: 0.3 }</style>${polygons}
  </svg>`)}`;
    };

    const result: ResponsiveCSSObject = {
      "& > *": {
        display: "none !important",
      },
      background: "none",
      border: "none",
      marginTop: 0,
    };

    for (let i = 1; i <= 5; i++) {
      result[`&[${attributeName}="${i}"]`] = {
        "&:before": {
          content: `url(${getContentUri(i)})`,
          display: "block",
          height,
          maxWidth: "100%",
          width,
          ..._css,
        },
      };
    }

    return result;
  };
};

const useStampedMainWidgetStyle = () => {
  const customScaleCss = useCustomScaleCss();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "useStampedMainWidgetStyle", {
    product: {
      prefix: "On",
    },
  });

  return (theme: ThemeEnhanced) => ({
    "#stamped-main-widget": {
      ".stamped-container": {
        margin: "0 !important",
      },
      ".stamped-header .stamped-review-options": {
        background: "none",
        padding: 0,
        textAlign: "center",
      },
      ".stamped-header-title": {
        display: "none",
      },

      ".stamped-review-option-scale": {
        ...customScaleCss("data-value-int"),
        justifyContent: "center",
      },
      ".stamped-review-option-scale-wrapper": {
        ...customScaleCss("data-value"),
      },
      ".stamped-review-options": {
        li: {
          order: 4,
        },
        'li[data-value="dog-size"]': {
          order: 0,
        },
        'li[data-value="ease-of-use"]': {
          order: 2,
        },
        'li[data-value="effectiveness"]': {
          order: 3,
        },
        'li[data-value="time-used"]': {
          order: 1,
        },
      },
      ".stamped-review-product": {
        "&:before": {
          content: `"${t("useStampedMainWidgetStyle:product.prefix")}"`,
          display: "inline",
          marginRight: "0.3em",
        },
        a: {
          "&:hover": {
            textDecoration: "none !important",
          },
          color: "inherit",
          fontWeight: theme.font.primary.weight.medium,
          textDecoration: "underline !important",
        },
      },
      ".stamped-summary-actions": {
        display: "none !important",
        visibility: "hidden !important",
      },
      ".stamped-summary-text-1": {
        ...headingBravo(theme),
      },
      margin: 0,
    },
  });
};

export const ReviewsMainWidget: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const stampedMainWidgetStyles = useStampedMainWidgetStyle();

  return (
    <ReviewsWidget _css={s(stampedMainWidgetStyles, _css)}>
      <div id="stamped-main-widget" />
    </ReviewsWidget>
  );
};

type ReviewsProductWidgetProps = ComponentStyleProps & { product: ProductCore };

export const ReviewsProductWidget: FC<ReviewsProductWidgetProps> = ({
  _css = {},
  product,
}) => {
  const stampedMainWidgetStyles = useStampedMainWidgetStyle();

  return (
    <ReviewsWidget
      _css={s(
        stampedMainWidgetStyles,
        {
          "#stamped-main-widget .stamped-review-product": {
            display: "none !important",
            visibility: "hidden !important",
          },
        },
        _css
      )}
    >
      <div
        data-image-url={product.featuredImage.edges?.[0].node.src ?? ""}
        data-name={product.title}
        data-product-id={getLegacyId(product.id)}
        data-url={getProductUrl(product)}
        id="stamped-main-widget"
      />
    </ReviewsWidget>
  );
};

const ReviewsWidget: FC<ComponentStyleProps> = ({ _css = {}, children }) => {
  const [isReady, setIsReady] = useState(false);

  // `Script.onLoad` only fires the initial mount, so we'll need to
  // check to see if Stamped is loaded
  useEffect(() => {
    if (window.StampedFn) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (config && isReady) {
      window.StampedFn?.init(config);
    }
  }, [isReady]);

  if (!config) return null;

  return (
    <LazyLoading _css={s({ minHeight: 500, width: "100%" }, _css)}>
      <Script
        async
        id="stamped-script-widget"
        onLoad={() => {
          setIsReady(true);

          // The Stamped Widget inserts its CSS before any other links, but
          // this causes problems with `next/head` - see https://github.com/vercel/next.js/issues/11012#issuecomment-653595223
          // We can workaround the issue by moving the Stamped CSS to the end of
          // the head.
          const css = document.querySelector(
            "link[href='//cdn1.stamped.io/files/widget.min.css']"
          );

          if (!css) {
            captureException(
              "Stamped Widget did not load expected external CSS"
            );
          } else {
            const detached = css.parentElement?.removeChild(css);

            if (detached) {
              document.head.appendChild(detached);
            }
          }
        }}
        src="https://cdn1.stamped.io/files/widget.min.js"
        strategy="lazyOnload"
        type="text/javascript"
      />
      {children}
    </LazyLoading>
  );
};
