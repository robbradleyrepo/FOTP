import { getCartLineItem } from "@sss/ecommerce/cart";
import { useOnUnmount } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Decorator } from "final-form";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CartData,
  CartLineItemActionType,
  CartLineItemUniqueProps,
  ComputedCartLineItem,
  EnhancedCartLineItem,
  getCoreCartLineItem,
  hasCompleteLineItemData,
  useCart,
} from "../cart";
import { Computed, Connection, Frequency } from "../common";
import {
  findDefaultVariant,
  findVariantBySku,
  getProductSubscriptionMetadata,
  getProductVariantList,
  getVariantPrices,
  Product,
  ProductSelectionDefaults,
  ProductSubscriptionMetadata,
  Variant,
  VariantWithSelectionPrices,
} from "../product";

export interface CoreOffer {
  products: string[];
}

export interface CartOffer extends CoreOffer {
  exclude?: { handles: string[] }; // Don't trigger offer if the cart contains a matching product
  handle: string; // Note: values of `"true"` and `"false"` should be avoided as they won't work with the `cart_offers` query string
  include: { skus: string[] }; // Trigger offer when adding a matching SKU
}

export enum CartOfferDestinationType {
  CART = "CART",
  CHECKOUT = "CHECKOUT",
}

export interface CartOfferDestination {
  path: string;
  type: CartOfferDestinationType | null;
}

const getCartLineItemByHandle = (
  lineItems: EnhancedCartLineItem[],
  handle: string
): EnhancedCartLineItem | null =>
  lineItems.find(({ variant }) => variant?.product?.handle === handle) ?? null;

const getDestinationPath = (
  destinationType: CartOfferDestinationType | null
): string => {
  switch (destinationType) {
    case CartOfferDestinationType.CART:
      return "/cart";
    default:
      return "/checkout/information";
  }
};

export const getCartOfferByHandle = (
  offers: CartOffer[],
  handle: string
): CartOffer | null => offers?.find((offer) => offer.handle === handle) ?? null;

export const shouldExcludeOffer = (offer: CartOffer, handle: string) =>
  offer.products.some((offerProductHandle) => offerProductHandle === handle) || // The offer is not applicable if the offer product matches the provided handle
  (offer.exclude?.handles ?? []).includes(handle); // Or if the provided handle is specifically excluded

interface GetApplicableCartOfferParams {
  addOns?: string[];
  cart: Pick<CartData, "lineItems" | "status">;
  sku: string;
  offers: CartOffer[];
  product: Pick<Product, "handle">;
  query: ParsedUrlQuery;
}

export const getApplicableCartOffer = ({
  addOns = [],
  cart: { lineItems, status },
  offers,
  product,
  query,
  sku,
}: GetApplicableCartOfferParams): CartOffer | null => {
  let applicableOffer = null;

  if (
    offers &&
    query.cart_offers !== "false" &&
    hasCompleteLineItemData(lineItems, status) && // We can't tell if the offer is applicable or not until all cart data is available
    !getCartLineItemByHandle(lineItems, product.handle) // Don't show any offers if the user already has the current product in their cart
  ) {
    const isApplicableOffer = (offer: CartOffer) =>
      !addOns.some((handle) => shouldExcludeOffer(offer, handle)) &&
      !lineItems.some(({ variant }) =>
        shouldExcludeOffer(offer, variant.product.handle)
      );

    if (typeof query.cart_offers === "string" && query.cart_offers !== "true") {
      // Use `cart_offers` offer handling in preference to SKU lookup
      const offer = getCartOfferByHandle(offers, query.cart_offers);

      if (offer && isApplicableOffer(offer)) {
        applicableOffer = offer;
      }
    } else {
      // Loop through all offers and find the first that applies
      for (const offer of offers) {
        if (offer.include.skus.includes(sku) && isApplicableOffer(offer)) {
          applicableOffer = offer;
          break;
        }
      }
    }
  }

  return applicableOffer;
};

interface CartOfferContextProps {
  destinationType: CartOfferDestinationType | null;
  referrer: ComputedCartLineItem | EnhancedCartLineItem | null;
  setDestinationType: (
    destinationType: CartOfferDestinationType | null
  ) => void;
  setReferrer: (partial: CartLineItemUniqueProps | null) => void;
}

const CartOfferContext = createContext<CartOfferContextProps | null>(null);

export const CartOfferProvider: FC = ({ children }) => {
  const { lineItems } = useCart();
  const [
    destinationType,
    setDestinationType,
  ] = useState<CartOfferDestinationType | null>(null);
  const [partial, setPartial] = useState<CartLineItemUniqueProps | null>(null);

  // Note that `getCartLineItem` will return `null` while the cart is
  // initialising, but as this only happens when the app first mounts we won't
  // have a value for `partial` anyway
  const referrer = partial ? getCartLineItem(lineItems, partial) : null;

  return (
    <CartOfferContext.Provider
      value={{
        destinationType,
        referrer,
        setDestinationType,
        setReferrer: setPartial,
      }}
    >
      {children}
    </CartOfferContext.Provider>
  );
};

const useCartOfferContext = () => {
  const context = useContext(CartOfferContext);

  if (!context) {
    throw new Error("`useCartOffer` must be used inside a `CartOfferProvider`");
  }

  return context;
};

export type CartOfferVariant = Computed<
  Variant,
  { prices: VariantWithSelectionPrices }
>;

export type CartOfferProduct = Computed<
  Omit<Product, "variants"> & { variants: Connection<CartOfferVariant> },
  {
    selection: Pick<ProductSelectionDefaults, "listedSkus">;
    subscription: ProductSubscriptionMetadata;
  }
>;

export interface CartOfferCoreSelection {
  handle: string;
  sku: string;
}
export interface CartOfferSelection extends CartOfferCoreSelection {
  frequency: Frequency | null;
  product: CartOfferProduct;
  variant: CartOfferVariant;
}

interface CartOfferResult {
  addToCart: (selection: CartOfferSelection) => void;
  computedProducts: CartOfferProduct[];
  decorator: Decorator<CartOfferCoreSelection>;
  destination: CartOfferDestination;
  getSelection: (selection: CartOfferCoreSelection) => CartOfferSelection;
  redirect: () => void;
  referrer: ComputedCartLineItem | EnhancedCartLineItem | null;
}

interface UseCartOfferOptions {
  products: Product[];
}

export const useCartOffer = ({
  products,
}: UseCartOfferOptions): CartOfferResult => {
  const { lineItemUpdate } = useCart();
  const {
    destinationType,
    referrer,
    setDestinationType,
    setReferrer,
  } = useCartOfferContext();
  const { locale } = useLocale();
  const resultRef = useRef<CartOfferResult | null>(null);
  const router = useRouter();

  // Clean up state once the offer is no longer being displayed
  useOnUnmount(() => {
    setDestinationType(null);
    setReferrer(null);
  });

  const computedProducts: CartOfferProduct[] = useMemo(
    () =>
      products.map((product) => {
        const computed = {
          selection: {
            listedSkus: getProductVariantList(product),
          },
          subscription: getProductSubscriptionMetadata(
            product,
            router.query,
            locale
          ),
        };

        return {
          ...product,
          computed,
          variants: {
            ...product.variants,
            edges: computed.selection.listedSkus.map((sku) => {
              const edge = product.variants.edges.find(
                ({ node }) => node.sku === sku
              );

              // Typeguard: we shouldn't hit this, as `listedSkus` will only
              // contain SKUs that exist in `product.variants`
              if (!edge) {
                throw new Error(
                  "Inconsistent data: variant specified by `listedSkus` is missing in `product.variants`"
                );
              }

              return {
                ...edge,
                node: {
                  ...edge.node,
                  computed: {
                    prices: getVariantPrices(
                      edge.node,
                      computed.subscription.hasSubscription &&
                        !!referrer?.frequency
                    ),
                  },
                },
              };
            }),
          },
        };
      }),
    [locale, products, referrer?.frequency, router.query]
  );

  const decorator: Decorator<CartOfferCoreSelection> = useCallback(
    (form) =>
      form.subscribe(
        ({ active, values }) => {
          // Use a ref as we can't change decorators once the form has mounted
          if (resultRef.current && active === "handle") {
            const { getSelection } = resultRef.current;
            const { variant } = getSelection(values);

            if (values.sku !== variant.sku) {
              form.change("sku", variant.sku);
            }
          }
        },
        {
          active: true,
          values: true,
        }
      ),
    []
  );

  const destination: CartOfferDestination = {
    path: getDestinationPath(destinationType),
    type: destinationType,
  };

  const redirect = () => {
    router.replace(destination.path);
  };

  const getSelection = ({ handle, sku }: CartOfferCoreSelection) => {
    const selectedProduct: CartOfferProduct | null =
      computedProducts.find((product) => handle === product.handle) ?? null;

    if (!selectedProduct) {
      throw new Error(
        `Invalid cart offer selection: product "${handle}" is not available in the current offer`
      );
    }

    const selectedVariant: CartOfferVariant | null =
      findVariantBySku(selectedProduct.variants, sku) ??
      findDefaultVariant(selectedProduct.variants);

    let frequency: Frequency | null = null;

    if (selectedProduct.computed.subscription.hasSubscription) {
      frequency = referrer?.frequency ?? null;

      if (
        selectedProduct.computed.subscription.isSubscriptionOnly &&
        !frequency
      ) {
        throw new Error(
          "Invalid cart offer selection: subscription-only products can only be selected when a frequency is set"
        );
      }
    }

    return {
      frequency,
      handle,
      product: selectedProduct,
      sku,
      variant: selectedVariant,
    };
  };

  const addToCart = (selection: CartOfferSelection) => {
    if (!referrer) {
      throw new Error("Missing referrer information");
    }

    lineItemUpdate({
      payload: {
        ...getCoreCartLineItem(selection.variant, selection.product),
        frequency: selection.frequency,
        productId: selection.product.id,
        properties: {},
        quantity: 1,
        variantId: selection.variant.id,
      },
      type: CartLineItemActionType.INCREMENT,
    });
  };

  // Assign the result to a ref so we can access it within the decorator
  resultRef.current = {
    addToCart,
    computedProducts,
    decorator,
    destination,
    getSelection,
    redirect,
    referrer,
  };

  return resultRef.current;
};

interface UseCartOfferRedirectOptions {
  destinationType: CartOfferDestinationType;
  disabled?: boolean;
  ignoreCart?: boolean;
  offers: CartOffer[];
  product: Product;
}

type CartOfferRedirect = (
  args: CartLineItemUniqueProps & { addOns?: string[]; sku: string }
) => Promise<boolean>;

export type UseCartOfferRedirectResult = {
  getOffer: (sku: string, addOns?: string[]) => CartOffer | null;
  prefetch: (sku: string, addOns?: string[]) => Promise<void>;
  redirect: CartOfferRedirect;
};

export const useCartOfferRedirect = ({
  destinationType,
  disabled = false,
  ignoreCart,
  offers,
  product,
}: UseCartOfferRedirectOptions): UseCartOfferRedirectResult => {
  const { lineItems, status } = useCart();
  const { setDestinationType, setReferrer } = useCartOfferContext();
  const router = useRouter();

  return useMemo(() => {
    const destinationPath = getDestinationPath(destinationType);

    const getOffer = (sku: string, addOns?: string[]) =>
      disabled
        ? null
        : getApplicableCartOffer({
            addOns,
            cart: { lineItems: ignoreCart ? [] : lineItems, status },
            offers,
            product,
            query: router.query,
            sku,
          });

    const getOfferRoute = (offer: CartOffer) =>
      `/products/${product.handle}/cart-offers/${offer.handle}`;

    const prefetch = (sku: string, addOns?: string[]) => {
      const offer = getOffer(sku, addOns);

      return router.prefetch(offer ? getOfferRoute(offer) : destinationPath);
    };

    const redirect: CartOfferRedirect = async ({
      addOns,
      frequency,
      properties,
      sku,
      variantId,
    }) => {
      // Force a hard reload if the `router.push` calls don't resolve
      const timeoutId = setTimeout(
        () => (window.location.href = destinationPath),
        5000
      );

      const offer = getOffer(sku, addOns);

      let result = false;

      if (!offer) {
        result = await router.push(destinationPath);
      } else {
        setDestinationType(destinationType);
        setReferrer({ frequency, properties, variantId });

        result = await router.push(getOfferRoute(offer));
      }

      clearTimeout(timeoutId);

      return result;
    };

    return {
      getOffer,
      prefetch,
      redirect,
    };
  }, [
    destinationType,
    disabled,
    ignoreCart,
    lineItems,
    offers,
    product,
    router,
    setDestinationType,
    setReferrer,
    status,
  ]);
};
