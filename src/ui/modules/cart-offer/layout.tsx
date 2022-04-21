import { captureException } from "@sentry/nextjs";
import {
  trackAddToCartEvent,
  trackViewItemEvent,
} from "@sss/ecommerce/analytics";
import {
  ComputedCartLineItem,
  EnhancedCartLineItem,
} from "@sss/ecommerce/cart";
import {
  CartOfferCoreSelection,
  CartOfferDestination,
  CartOfferProduct,
  CartOfferSelection,
  useCartOffer,
} from "@sss/ecommerce/offer/cart";
import { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Form } from "react-final-form";

import {
  belt as _belt,
  ComponentStyleProps,
  gutterX,
  percentage,
  px,
  py,
  s,
  useTheme,
} from "@/common/ui/utils";

import { Grid, Item } from "../../base/grid";
import { PageSpinner } from "../../base/spinner";
import { ToastRack, ToastType, useToastController } from "../../base/toast";

const enUsResource = {
  busy: "Fetching your cart…",
  error: "There was a problem adding that item to your cart",
  orderType: {
    otp: "order",
    subscription: "subscription",
  },
};

const belt = s(_belt, { maxWidth: [520, null, null, 1140] });

const buttonSmall = s((t) => ({
  ...px(t.spacing.sm),
  ...py(17),
  letterSpacing: "0.05em",
  lineHeight: "14px",
  whiteSpace: "nowrap",
  width: "100%",
}));

const styles = {
  belt,
  buttonSmall,
};

interface CartOfferLayoutComponents {
  Image: FC<ComponentStyleProps>;
}

export enum CartOfferType {
  MAIN = "MAIN",
  SALES = "SALES",
}

interface CartOfferLayoutContextProps {
  components: CartOfferLayoutComponents;
  destination: CartOfferDestination;
  isBusy: boolean;
  products: CartOfferProduct[];
  selection: CartOfferSelection;
  styles: typeof styles;
  referrer: ComputedCartLineItem | EnhancedCartLineItem;
  type: CartOfferType;
}

const CartOfferLayoutContext = createContext<CartOfferLayoutContextProps | null>(
  null
);

export const useCartOfferLayout = () => {
  const context = useContext(CartOfferLayoutContext);

  if (!context) {
    throw new Error(
      "`useCartOfferLayout` must be used inside a `CartOfferLayout` provider"
    );
  }

  return context;
};

const trackingSources = new Map<CartOfferType, string>([
  [CartOfferType.MAIN, "cart-offer-main"],
  [CartOfferType.SALES, "cart-offer"],
]);

type CartOfferNodes = Record<
  "banner" | "footer" | "header" | "primary" | "secondary",
  ReactNode
>;

type CartOfferLayoutFormProps = Omit<CartOfferLayoutContextProps, "styles"> &
  CartOfferNodes & { trackingSource?: string };

const CartOfferLayoutForm: FC<CartOfferLayoutFormProps> = ({
  banner,
  components,
  destination,
  footer,
  header,
  isBusy,
  primary,
  products,
  referrer,
  secondary,
  selection,
  trackingSource,
  type,
}) => {
  const hasTrackedViewsRef = useRef(false);
  const theme = useTheme();

  useEffect(() => {
    if (hasTrackedViewsRef.current || !referrer || !trackingSource) {
      return;
    }
    trackViewItemEvent(
      selection.product,
      selection.variant,
      trackingSource,
      selection.frequency
    );

    hasTrackedViewsRef.current = true;
  }, [destination, hasTrackedViewsRef, referrer, selection, trackingSource]);

  const value = {
    components,
    destination,
    isBusy,
    products,
    referrer,
    selection,
    styles,
    type,
  };

  return (
    <CartOfferLayoutContext.Provider value={value}>
      <main
        css={s({
          display: "flex",
          flexDirection: "column-reverse",
          paddingBottom: [124, null, null, 0],
        })}
      >
        <div
          css={s(gutterX, (t) => ({
            paddingBottom: t.spacing.xxl,
            paddingTop: [t.spacing.md, null, null, t.spacing.xxl],
          }))}
        >
          <Grid
            _css={s(belt)}
            gx={theme.spacing.xl}
            innerCss={s({
              justifyContent: "space-between",
            })}
          >
            <Item
              _css={s({ maxWidth: 600 })}
              width={[percentage(1), null, null, percentage(3 / 5)]}
            >
              {header}
              <section>{primary}</section>
            </Item>
            <Item width={[percentage(1), null, null, percentage(2 / 5)]}>
              <aside>{secondary}</aside>
            </Item>
          </Grid>
        </div>
        <aside
          css={s((t) => ({
            backgroundColor: t.color.background.base,
            bottom: 0,
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.15)",
            display: [null, null, null, "none"],
            left: 0,
            padding: t.spacing.sm,
            position: "fixed",
            width: "100%",
          }))}
        >
          {footer}
        </aside>
        <aside
          css={s(gutterX, (t) => ({
            borderBottomColor: t.color.border.light,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            ...py(t.spacing.sm),
          }))}
        >
          {banner}
        </aside>
      </main>
    </CartOfferLayoutContext.Provider>
  );
};

type CartOfferLayoutProps = Pick<
  CartOfferLayoutContextProps,
  "components" | "type"
> &
  CartOfferNodes & {
    initialSelection: CartOfferCoreSelection;
    products: Product[];
  };

const CartOfferLayout: FC<CartOfferLayoutProps> = ({
  initialSelection,
  products,
  type,
  ...rest
}) => {
  const {
    addToCart,
    computedProducts,
    decorator,
    destination,
    getSelection,
    redirect,
    referrer,
  } = useCartOffer({
    products,
  });
  const toast = useToastController();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartOfferLayout", enUsResource);

  const trackingSource = trackingSources.get(type);

  useEffect(() => {
    // We can't render the page if we don't have a referrer or destination
    // type. This should only happen when the user hits an old link, in which
    // case we wouldn't want to show the offer anyway.
    if (!referrer || !destination.type) {
      redirect();
    }
  }, [destination, redirect, referrer]);

  // Render a spinner before we redirect
  if (!referrer || !destination.type) {
    return <PageSpinner label={t("cartOfferLayout:busy")} />;
  }

  const handleAddToCart = (values: CartOfferCoreSelection) => {
    try {
      const selection = getSelection(values);

      addToCart(selection);

      if (trackingSource) {
        trackAddToCartEvent(
          selection.product,
          selection.variant,
          trackingSource,
          1,
          selection.frequency
        );
      } else {
        // We'll only hit this if we don't set a valid `trackingSource` for
        // each `CartOfferType`
        const error = new Error(
          `No tracking source provided for CartOfferType "${type}"`
        );

        if (process.env.NODE_ENV === "production") {
          captureException(error);
        } else {
          throw error;
        }
      }

      redirect();
    } catch (error) {
      toast.push({
        children: t("cartOfferLayout:error"),
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <Form
      decorators={[decorator]}
      initialValues={initialSelection}
      onSubmit={handleAddToCart}
    >
      {({ handleSubmit, submitting, values: { handle, sku } }) => {
        const selection = getSelection({ handle, sku });

        return (
          <form onSubmit={handleSubmit}>
            <CartOfferLayoutForm
              {...rest}
              destination={destination}
              isBusy={submitting}
              products={computedProducts}
              referrer={referrer}
              selection={selection}
              trackingSource={trackingSource}
              type={type}
            />
            <ToastRack
              _css={s({
                height: 0,
                position: "fixed",
                right: 0,
                top: [null, null, null, 80],
                zIndex: 99999,
              })}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default CartOfferLayout;
