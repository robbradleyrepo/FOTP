import { useCart } from "@sss/ecommerce/cart";
import { getLegacyId, Money, moneyFns } from "@sss/ecommerce/common";
import { useInView, useScript } from "@sss/hooks";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ComponentStyleProps, greedy, s } from "@/common/ui/utils";

import SHOPPING_GIVES from "./config";
import { ShoppingGivesWidgetController } from "./types";

const skeletonStyle = (loaded: boolean) =>
  s(greedy, (t) => ({
    "@keyframes loading": {
      "0%": {
        opacity: 0.6,
      },
      "100%": {
        opacity: 1,
      },
    },
    animationDirection: "alternate",
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationName: "loading",
    animationTimingFunction: "ease",
    backgroundColor: loaded ? null : t.color.background.feature1,
    transition: "background-color 2s 1.5s",
    zIndex: 0,
  }));

const widgetStyle = (loaded: boolean) => ({
  opacity: loaded ? 1 : 0,
  transition: "opacity 2s 1.5s",
});

const useControllerSpy = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const isCurrentController = useCallback(
    ({ templater }: ShoppingGivesWidgetController): boolean =>
      templater?.targetElement?.parentElement === ref.current,
    []
  );

  return { isCurrentController, ref };
};

export enum CartWidgetType {
  COMPACT = "compact-cart",
  CONTAINED = "contained-cart",
  FULL = "full-cart",
}

interface CartWidgetProps extends ComponentStyleProps {
  targetId?: string;
  type?: CartWidgetType;
}

export const CartWidget: FC<CartWidgetProps> = ({
  _css = {},
  targetId = "shopping-gives-cart-widget",
  type = CartWidgetType.CONTAINED,
}) => {
  const { storeId, testMode } = SHOPPING_GIVES;
  const { lineItems } = useCart();
  const { isCurrentController, ref } = useControllerSpy<HTMLDivElement>();
  const [inViewRef, inView] = useInView({
    rootMargin: "30%",
    triggerOnce: true,
  });

  const enabled = !!storeId;
  const src = `https://cdn.shoppinggives.com/cc-utilities/${type}.js?${stringify(
    {
      sid: storeId,
      "target-element": `#${targetId}`,
      "test-mode": testMode || undefined,
    }
  )}`;

  const { loaded } = useScript({
    checkForExisting: false, // Reload the script whenever the component mounts to force reinitialisation
    enabled: enabled && inView,
    src,
  });

  useLayoutEffect(
    () => () => {
      // Remove the widget's cart controller when the widget unmounts
      window.sgCartControllers = window.sgCartControllers?.filter(
        (controller) => !isCurrentController(controller)
      );
    },
    [isCurrentController]
  );

  useEffect(() => {
    // We'll unnecessarily update this array if we're running multiple
    // cart widgets at the same time, but it's a cheap calculation and more
    // hassle than it's worth to avoid it
    window.cc_cart_items = lineItems.map(({ linePrice, variantId }) => ({
      // We'll use the `linePrice` with a zero discount and quantity of one
      // as it simplifies the calculations (especially around subscriptions)
      discount: 0,
      id: variantId,
      price: moneyFns.toFloat(linePrice),
      quantity: 1,
    }));
    window.sgCartControllers?.find(isCurrentController)?.refreshCart();
  }, [isCurrentController, loaded, lineItems]);

  return enabled ? (
    <div css={s({ position: "relative" }, _css)} ref={inViewRef}>
      {inView && <Loader />}
      <div css={s(skeletonStyle(loaded))} />
      <div
        ref={ref}
        css={s(widgetStyle(loaded), {
          ".shoppinggives-tag": {
            fontFamily: "inherit !important",
          },
          minHeight: [97, 101, 121, 121],
        })}
        id={targetId}
      />
    </div>
  ) : null;
};

export const Loader = () => {
  const { storeId, testMode } = SHOPPING_GIVES;

  useScript({
    checkForExisting: true,
    enabled: !!storeId,
    src: `https://cdn.shoppinggives.com/cc-utilities/sgloader.js?${stringify({
      sid: storeId,
      "test-mode": testMode || undefined,
    })}`,
  });

  return null;
};

export enum ProductWidgetType {
  COMPACT = "compact-product",
  CONTAINED = "contained-product",
  FULL = "full-product",
}

interface ProductWidgetProps extends ComponentStyleProps {
  hiddenCss?: ComponentStyleProps["_css"];
  id: string;
  price: Money;
  targetId?: string;
  type?: ProductWidgetType;
}

export const ProductWidget: FC<ProductWidgetProps> = ({
  _css = {},
  hiddenCss = {},
  id,
  price,
  targetId = "shopping-gives-product-widget",
  type = ProductWidgetType.CONTAINED,
}) => {
  const { storeId, testMode } = SHOPPING_GIVES;
  const { isCurrentController, ref } = useControllerSpy<HTMLDivElement>();
  const [inViewRef, inView] = useInView({
    rootMargin: "30%",
    triggerOnce: true,
  });
  const { query } = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  const enabled = !!storeId;
  const minHeight = [97, 82, 102, 121];
  const priceValue = moneyFns.toFloat(price);
  const shouldHide = query.sg === "false";
  const subitemId = getLegacyId(id);

  /**
   * Memoize the `src` as:
   * 1. We need to load the widget using variant properties, but we don't want
   *    to reload the script when the variant changes, and
   * 2. We want to prevent the widget type from changing once it has mounted
   */
  const src = useMemo(
    () =>
      `https://cdn.shoppinggives.com/cc-utilities/${type}.js?${stringify({
        price: priceValue,
        sid: storeId,
        "subitem-id": subitemId,
        "target-element": `#${targetId}`,
        "test-mode": testMode || undefined,
      })}`,
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { loaded } = useScript({
    checkForExisting: false, // Reload the script whenever the component mounts to force reinitialisation
    enabled: enabled && inView,
    src,
  });

  useLayoutEffect(
    () => () => {
      // Remove the widget's product controller when the widget unmounts
      window.sgProductControllers = window.sgProductControllers?.filter(
        (controller) => !isCurrentController(controller)
      );
    },
    [isCurrentController]
  );

  useEffect(() => {
    window.sgProductControllers
      ?.find(isCurrentController)
      ?.setSubitem(subitemId, priceValue);
  }, [isCurrentController, loaded, priceValue, subitemId]);

  useEffect(() => {
    if (shouldHide && !isHidden) {
      setIsHidden(true);
    }
  }, [isHidden, shouldHide]);

  return enabled ? (
    <div
      css={s(
        { position: "relative" },
        _css,
        {
          height: !loaded || shouldHide ? minHeight : null,
          ...(isHidden && {
            height: 0,
            margin: 0,
            opacity: 0,
            visibility: "hidden",
          }),
          transition: shouldHide
            ? "height 500ms, margin 500ms, opacity 500ms, visibility 0ms 500ms"
            : null,
        },
        hiddenCss
      )}
      ref={inViewRef}
    >
      {inView && <Loader />}
      <div css={s(skeletonStyle(loaded))} />
      <div
        ref={ref}
        css={s(widgetStyle(loaded), {
          ".shoppinggives-tag": {
            fontFamily: "inherit !important",
          },
          minHeight,
        })}
        id={targetId}
      />
    </div>
  ) : null;
};
