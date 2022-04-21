import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { sanitize } from "@sss/apollo";
import { ApolloError, ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import produce from "immer";
import isEqual from "lodash.isequal";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import store from "store/dist/store.modern";
import { RequireAtLeastOne } from "type-fest";
import { useImmerReducer } from "use-immer";
import { v4 as uuid } from "uuid";

import type { CheckoutData } from "./checkout";
import { Frequency, Money, moneyFns } from "./common";
import ECOMMERCE from "./config";
import {
  findProductContainer,
  Product,
  ProductContainer,
  ProductContainerOption,
  ProductContainerType,
  ProductCore,
  productCoreFragment,
  Variant,
  variantFragment,
} from "./product";
import type { ShopifyCheckoutData } from "./shopify-checkout";

export const CART_STATE_VERSION = 4;

export const VARIANT_INFO = gql`
  query VARIANT_INFO($ids: [ID!]!) {
    variants: sNodes(ids: $ids) {
      ... on ProductVariant {
        ...variant
        product {
          ...productCore
        }
      }
    }
  }
  ${variantFragment}
  ${productCoreFragment}
`;

interface VariantInfo {
  variants: Array<Variant & { product: ProductCore }>;
}

export type CartCustomAttributes = Record<string, string>;

export enum CartStatus {
  ERROR = "ERROR",
  FETCHING = "FETCHING",
  INITIALIZING = "INITIALIZING",
  READY = "READY",
}

export interface CartState {
  checkoutId: null | string;
  customAttributes: CartCustomAttributes;
  discountCode: null | string;
  id: null | string;
  lineItems: PersistedCartLineItem[];
  rCheckoutId: null | string;
}

export interface InitializedCartState extends CartState {
  id: string;
}

export interface StoredCartState extends InitializedCartState {
  version: number;
}

// Core data that must be included with any add to cart action
export interface CoreCartLineItem {
  containerPrices: Record<
    ProductContainerType,
    Record<ProductContainerOption, Money | null>
  > | null;
  handle: string;
  imageUrl: string;
  productId: string;
  subscriptionUnitPrice: Money | null;
  subtitle: string;
  title: string;
  unitPrice: Money;
  variantId: string;
}

// With extra data set by user on add to cart
export interface CartLineItem extends CoreCartLineItem {
  containerUpgrade?: boolean;
  id?: string;
  frequency: null | Frequency;
  properties: Record<string, string>;
  quantity: number;
}

// With extra data generated during cart update
export interface PersistedCartLineItem extends CartLineItem {
  id: string;
}

// With extra data that is computed synchronously on add to cart
export interface ComputedCartLineItem extends PersistedCartLineItem {
  linePrice: Money;
}

// With extra data loaded asynchronously after add to cart
export interface EnhancedCartLineItem extends ComputedCartLineItem {
  container: ProductContainer | null;
  lineCompareAtPrice: Money | null;
  variant: Variant & { product: ProductCore | Product };
}

// The properties required to identify a unique line item
export type CartLineItemUniqueProps = Pick<
  CartLineItem,
  "frequency" | "properties" | "variantId"
>;

export enum CartLineItemActionType {
  DECREMENT = "DECREMENT",
  INCREMENT = "INCREMENT",
  REMOVE = "REMOVE",
  REPLACE_ALL = "REPLACE_ALL",
  SET_SUBSCRIPTION = "SET_SUBSCRIPTION",
}

export type CartLineItemAction =
  | {
      type: CartLineItemActionType.INCREMENT;
      payload: CartLineItem;
    }
  | {
      type: CartLineItemActionType.DECREMENT;
      payload: CartLineItem;
    }
  | {
      type: CartLineItemActionType.REMOVE;
      payload: Omit<CartLineItem, "quantity">;
    }
  | {
      type: CartLineItemActionType.REPLACE_ALL;
      payload: CartLineItem;
    }
  | {
      type: CartLineItemActionType.SET_SUBSCRIPTION;
      payload: CartLineItemUniqueProps & { newFrequency: Frequency | null };
    };

export enum CartActionType {
  CHECKOUT_ACTIVE = "CHECKOUT_ACTIVE",
  INIT = "INIT",
  LOAD = "LOAD",
  SET_CUSTOM_ATTRIBUTES = "SET_CUSTOM_ATTRIBUTES",
  SET_DISCOUNT_CODE = "SET_DISCOUNT_CODE",
}

type CartAction =
  | { type: CartActionType.INIT; payload: { id: string } }
  | { type: CartActionType.LOAD; payload: InitializedCartState }
  | { type: CartActionType.CHECKOUT_ACTIVE; payload: CheckoutActivePayload }
  | {
      type: CartActionType.SET_CUSTOM_ATTRIBUTES;
      payload: Pick<CartState, "customAttributes">;
    }
  | {
      type: CartActionType.SET_DISCOUNT_CODE;
      payload: Pick<CartState, "discountCode">;
    }
  | CartLineItemAction;

type CheckoutActivePayload = RequireAtLeastOne<{
  checkoutId: string;
  rCheckoutId: string;
}>;

const isEqualFrequency = (f1: Frequency | null, f2: Frequency | null) =>
  (f1 === null && f2 === null) ||
  (f1?.orderIntervalFrequency === f2?.orderIntervalFrequency &&
    f1?.orderIntervalUnit === f2?.orderIntervalUnit);

const getItem = <T extends CartLineItem>(
  lineItems: T[],
  { variantId, frequency, properties }: CartLineItemUniqueProps
): { index: number; item: T | null } => {
  const index = lineItems.findIndex(
    (i) =>
      i.variantId === variantId &&
      isEqualFrequency(i.frequency, frequency) &&
      isEqual(i.properties, properties)
  );
  return index > -1
    ? { index, item: lineItems[index] }
    : { index: -1, item: null };
};

export const getCartLineItem = <T extends CartLineItem>(
  lineItems: T[],
  criteria: CartLineItemUniqueProps
): T | null => getItem(lineItems, criteria).item;

const immerReducer = (draft: CartState, action: CartAction) => {
  const incItem = (
    cart: CartState,
    newItem: CartLineItem | PersistedCartLineItem
  ) => {
    const { item: existingItem } = getItem(cart.lineItems, newItem);
    if (existingItem) {
      existingItem.containerUpgrade =
        existingItem.containerUpgrade || newItem.containerUpgrade;
      existingItem.quantity += newItem.quantity;
    } else {
      cart.lineItems.push({ ...newItem, id: newItem.id ?? uuid() });
    }
  };

  const decItem = (cart: CartState, item: CartLineItem) => {
    const { item: existingItem, index: existingItemIndex } = getItem(
      cart.lineItems,
      item
    );

    if (existingItem) {
      if (existingItem.quantity <= item.quantity) {
        cart.lineItems.splice(existingItemIndex, 1);
      } else {
        existingItem.quantity -= item.quantity;
      }
    }
  };

  const removeItem = (
    cart: CartState,
    item: Omit<CartLineItem, "quantity">
  ) => {
    const { item: existingItem, index: existingItemIndex } = getItem(
      cart.lineItems,
      item
    );

    if (existingItem) {
      cart.lineItems.splice(existingItemIndex, 1);
    }
  };

  const setSubscription = (
    cart: CartState,
    item: CartLineItemUniqueProps & { newFrequency: Frequency | null }
  ) => {
    const existingItem = getItem(cart.lineItems, item);

    if (!existingItem.item) {
      throw new Error(
        "Invalid cart action: an existing CartLineItem is required"
      );
    }

    const existingSubscriptionItem = getItem(cart.lineItems, {
      ...item,
      frequency: item.newFrequency,
    });

    // If we already have an item with the same frequency the requested one,
    // we'll add it to the item being modified
    if (existingSubscriptionItem.item) {
      existingItem.item.properties = {
        ...existingSubscriptionItem.item.properties,
        ...existingItem.item.properties,
      };
      existingItem.item.quantity += existingSubscriptionItem.item.quantity;
      cart.lineItems.splice(existingSubscriptionItem.index, 1);
    }

    existingItem.item.frequency = item.newFrequency;
  };

  switch (action.type) {
    case "INIT": {
      draft.id = action.payload.id;
      draft.checkoutId = null;
      draft.lineItems = [];
      draft.rCheckoutId = null;
      draft.customAttributes = {};
      return;
    }

    case "LOAD": {
      draft.id = action.payload.id;
      draft.checkoutId = action.payload.checkoutId;
      draft.discountCode = action.payload.discountCode;
      draft.lineItems = action.payload.lineItems;
      draft.rCheckoutId = action.payload.rCheckoutId;
      draft.customAttributes = action.payload.customAttributes;
      return;
    }

    case "SET_CUSTOM_ATTRIBUTES":
      draft.customAttributes = action.payload.customAttributes;
      return;

    case "SET_DISCOUNT_CODE":
      draft.discountCode = action.payload.discountCode;
      return;

    case "CHECKOUT_ACTIVE": {
      draft.checkoutId =
        "checkoutId" in action.payload
          ? action.payload.checkoutId ?? null
          : draft.checkoutId;
      draft.rCheckoutId =
        "rCheckoutId" in action.payload
          ? action.payload.rCheckoutId ?? null
          : draft.rCheckoutId;
      return;
    }

    case CartLineItemActionType.SET_SUBSCRIPTION: {
      setSubscription(draft, action.payload);
      return;
    }

    case CartLineItemActionType.INCREMENT: {
      incItem(draft, action.payload);
      return;
    }

    case CartLineItemActionType.DECREMENT: {
      decItem(draft, action.payload);
      return;
    }

    case CartLineItemActionType.REMOVE: {
      removeItem(draft, action.payload);
      return;
    }

    case CartLineItemActionType.REPLACE_ALL: {
      draft.lineItems = [
        { ...action.payload, id: action.payload.id ?? uuid() },
      ];
      return;
    }

    default: {
      return;
    }
  }
};

export const reducer = produce(immerReducer);

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const INITIAL_STATE: CartState = {
  checkoutId: null,
  customAttributes: {},
  discountCode: null,
  id: null,
  lineItems: [],
  rCheckoutId: null,
};

export const CartProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(immerReducer, INITIAL_STATE);
  const client = useApolloClient();

  useEffect(() => {
    const restoreCart = async () => {
      let savedState = loadCart();

      if (savedState !== null) {
        const { checkoutId, rCheckoutId } = savedState;

        const rQuery = rCheckoutId
          ? import("./checkout").then(({ CHECKOUT_COMPLETED_CORE }) =>
              client.query<CheckoutData>({
                // Avoid caching the query otherwise `null` results may persist
                // after the checkout is completed
                fetchPolicy: "no-cache",
                query: CHECKOUT_COMPLETED_CORE,
                variables: { id: rCheckoutId },
              })
            )
          : null;
        const sQuery = checkoutId
          ? import("./shopify-checkout").then(({ SHOPIFY_CHECKOUT }) =>
              client.query<ShopifyCheckoutData>({
                context: { shopify: true },
                query: SHOPIFY_CHECKOUT,
                variables: { id: checkoutId },
              })
            )
          : null;

        const queries = [rQuery, sQuery].filter(Boolean) as Promise<
          ApolloQueryResult<CheckoutData | ShopifyCheckoutData>
        >[];

        if (queries.length) {
          const results = await Promise.all(queries);

          if (
            results.some((result) => {
              if ("checkout" in result.data) {
                if (!result.data.checkout) {
                  captureException(new Error("Missing Shopify checkout"), {
                    extra: { checkoutId },
                  });
                  return true;
                } else if (result.data.checkout.completedAt) {
                  return true;
                }
              }

              return (
                "rCheckout" in result.data &&
                !!result.data.rCheckout?.completedAt
              );
            })
          ) {
            savedState = null;
          }
        }
      }

      dispatch(
        savedState
          ? { payload: savedState, type: CartActionType.LOAD }
          : { payload: { id: uuid() }, type: CartActionType.INIT }
      );
    };

    restoreCart();
  }, []);

  useEffect(() => {
    if (state.id === null) return;
    saveCart(state);
  }, [state]);

  return (
    <CartContext.Provider value={{ dispatch, state }}>
      {children}
    </CartContext.Provider>
  );
};

interface GetCoreCartLineItem {
  (variant: Variant & { product: ProductCore }): CoreCartLineItem;
  (
    variant: Variant,
    product: Pick<ProductCore, "id" | "title">
  ): CoreCartLineItem;
}

export const getCoreCartLineItem: GetCoreCartLineItem = (
  ...args: any[] //eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  const variant: Variant | (Variant & { product: Product }) = args[0];
  const product: Product = "product" in variant ? variant.product : args[1];

  const getContainerOptionsPrice = (
    option: Record<ProductContainerOption, ProductContainer | null>
  ) =>
    option && {
      [ProductContainerOption.BASE]:
        option[ProductContainerOption.BASE]?.price ?? null,
      [ProductContainerOption.UPGRADE]:
        option[ProductContainerOption.UPGRADE]?.price ?? null,
    };

  return {
    containerPrices: product.containers && {
      [ProductContainerType.OTP]: getContainerOptionsPrice(
        product.containers.otp
      ),
      [ProductContainerType.SUB]: getContainerOptionsPrice(
        product.containers.sub
      ),
    },
    handle: product.handle,
    imageUrl: variant.image.url,
    productId: product.id,
    subscriptionUnitPrice: variant.subscriptionPriceAmount?.value
      ? {
          amount: variant.subscriptionPriceAmount.value,
          currencyCode: variant.priceV2.currencyCode,
        }
      : null,
    subtitle: variant.title,
    title: product.title,
    unitPrice: variant.priceV2,
    variantId: variant.id,
  };
};

const getVariantIds = (cartState: CartState) =>
  [...new Set(cartState.lineItems.map((i) => i.variantId))].sort();

/**
 * Add subtotal to lineItems and return per-cart total
 * and item count.
 *
 * XXX could use a more expressive name or splitting in per-value selector
 */

export const useEnhancedData = (
  cartLineItems: PersistedCartLineItem[],
  variantInfo?: VariantInfo
): {
  lineItems: (ComputedCartLineItem | EnhancedCartLineItem)[];
  itemCount: number;
  lineItemsSavingsPrice: Money | null;
  lineItemsSubtotalPrice: Money;
  shippingThreshold: Money | null;
} => {
  return useMemo(() => {
    const getCurrencyCode = () =>
      lineItems.find(({ linePrice }) => !!linePrice)?.linePrice?.currencyCode ??
      "USD";

    const lineItems: (
      | ComputedCartLineItem
      | EnhancedCartLineItem
    )[] = cartLineItems.map((cartLineItem) => {
      const variant = variantInfo?.variants.find(
        (variant) => variant.id === cartLineItem.variantId
      );

      const lineItem: PersistedCartLineItem = variant
        ? {
            ...cartLineItem,
            ...getCoreCartLineItem(variant), // Ensure product data is up-to-date
          }
        : cartLineItem;

      const containerOption =
        !lineItem.frequency && lineItem.containerUpgrade
          ? ProductContainerOption.UPGRADE
          : ProductContainerOption.BASE;
      const containerType = lineItem.frequency
        ? ProductContainerType.SUB
        : ProductContainerType.OTP;

      const containerPrice =
        lineItem.containerPrices?.[containerType][containerOption] ?? null;

      let linePrice = moneyFns.multiply(
        lineItem.frequency !== null && lineItem.subscriptionUnitPrice
          ? lineItem.subscriptionUnitPrice
          : lineItem.unitPrice,
        lineItem.quantity
      );

      if (containerPrice) {
        linePrice = moneyFns.add(linePrice, containerPrice);
      }

      const computedLineItem: ComputedCartLineItem = {
        ...lineItem,
        linePrice,
      };

      if (!variant) {
        return computedLineItem;
      }

      const container = findProductContainer(
        variant.product.containers,
        containerType,
        containerOption
      );

      let lineCompareAtPrice: Money | null = moneyFns.multiply(
        variant.compareAtPriceV2 ?? variant.priceV2,
        lineItem.quantity
      );

      if (container) {
        lineCompareAtPrice = moneyFns.add(
          lineCompareAtPrice,
          container.compareAtPrice ?? container.price
        );
      }

      if (lineCompareAtPrice.amount === linePrice.amount) {
        lineCompareAtPrice = null;
      }

      return {
        ...computedLineItem,
        container,
        lineCompareAtPrice,
        variant,
      };
    });

    let lineItemsSavingsPrice: Money | null = {
      amount: "0.0",
      currencyCode: getCurrencyCode(),
    };

    for (const lineItem of lineItems) {
      // Return `null` if we can't calculate the savings with the current
      // cart data
      if (!("lineCompareAtPrice" in lineItem)) {
        lineItemsSavingsPrice = null;
        break;
      }

      if (!lineItem.lineCompareAtPrice) {
        continue;
      }

      const lineItemSavings = moneyFns.subtract(
        lineItem.lineCompareAtPrice,
        lineItem.linePrice
      );

      lineItemsSavingsPrice = moneyFns.add(
        lineItemsSavingsPrice,
        lineItemSavings
      );
    }

    return {
      itemCount: lineItems.reduce(
        (total, lineItem) => total + lineItem.quantity,
        0
      ),
      lineItems,
      lineItemsSavingsPrice,
      lineItemsSubtotalPrice: lineItems.reduce(
        (total, lineItem) => moneyFns.add(total, lineItem.linePrice),
        {
          amount: "0.0",
          currencyCode: getCurrencyCode(),
        }
      ),
      shippingThreshold: ECOMMERCE.shippingThreshold
        ? {
            amount: ECOMMERCE.shippingThreshold.toString(),
            currencyCode: getCurrencyCode(),
          }
        : null,
    };
  }, [cartLineItems, variantInfo]);
};

interface GetHasSubscriptionParams {
  lineItems: Pick<CartLineItem, "frequency">[];
}

export const getHasSubscription = ({ lineItems }: GetHasSubscriptionParams) =>
  lineItems.some(({ frequency }) => !!frequency);

export interface CartData {
  checkoutId: string | null;
  customAttributes: CartCustomAttributes;
  discountCode: string | null;
  id: string | null;
  itemCount: number;
  lineItems: (ComputedCartLineItem | EnhancedCartLineItem)[];
  lineItemsSavingsPrice: Money | null;
  lineItemsSubtotalPrice: Money;
  rCheckoutId: string | null;
  shippingThreshold: Money | null;
  status: CartStatus;
}

export interface EnhancedCartData extends CartData {
  lineItems: EnhancedCartLineItem[];
  lineItemsSubtotalPrice: Money;
}

const getStatus = (
  id: CartData["id"],
  lineItems: CartData["lineItems"],
  error?: ApolloError
): CartStatus => {
  if (error) {
    return CartStatus.ERROR;
  }

  if (!id) {
    return CartStatus.INITIALIZING;
  }

  return lineItems.some((lineItem) => !("variant" in lineItem))
    ? CartStatus.FETCHING
    : CartStatus.READY;
};

// Typeguard so we can destructure the `useCart` result without inspecting the
// line items unnecessarily
export const hasCompleteLineItemData = (
  _lineItems:
    | (ComputedCartLineItem | EnhancedCartLineItem)[]
    | EnhancedCartLineItem[],
  status: CartStatus
): _lineItems is EnhancedCartLineItem[] => status === CartStatus.READY;

export const useCart = (): CartData & {
  associateCheckout: (payload: CheckoutActivePayload) => void;
  lineItemUpdate: (input: CartLineItemAction) => void;
  replace: (savedState: Omit<CartState, "version">) => void;
  reset: () => void;
  setCustomAttributes: (customAttributes: CartCustomAttributes) => void;
  setDiscountCode: (discountCode: string | null) => void;
} => {
  const context = useContext(CartContext);
  if (!context) throw new Error("Must be called from within CartProvider");

  const { state: cartState, dispatch } = context;

  const variantInfoQueryResult = useQuery<VariantInfo>(VARIANT_INFO, {
    skip: typeof window === "undefined" || cartState.lineItems.length === 0,
    variables: { ids: getVariantIds(cartState) },
  });

  const {
    lineItems,
    itemCount,
    lineItemsSavingsPrice,
    lineItemsSubtotalPrice,
    shippingThreshold,
  } = useEnhancedData(cartState.lineItems, variantInfoQueryResult.data);

  const status = useMemo(
    () => getStatus(cartState.id, lineItems, variantInfoQueryResult.error),
    [cartState.id, lineItems, variantInfoQueryResult.error]
  );

  const lineItemUpdate = useCallback(
    (input: CartLineItemAction) => dispatch(input),
    [dispatch]
  );

  const associateCheckout = useCallback(
    (payload: CheckoutActivePayload) => {
      dispatch({ payload, type: CartActionType.CHECKOUT_ACTIVE });
    },
    [dispatch]
  );

  const replace = useCallback(
    (savedState: CartState) => {
      dispatch({
        payload: { ...savedState, id: savedState.id ?? uuid() },
        type: CartActionType.LOAD,
      });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ payload: { id: uuid() }, type: CartActionType.INIT });
  }, [dispatch]);

  const setCustomAttributes = useCallback(
    (customAttributes: CartCustomAttributes) => {
      dispatch({
        payload: { customAttributes },
        type: CartActionType.SET_CUSTOM_ATTRIBUTES,
      });
    },
    [dispatch]
  );

  const setDiscountCode = useCallback(
    (discountCode: string | null) => {
      dispatch({
        payload: { discountCode },
        type: CartActionType.SET_DISCOUNT_CODE,
      });
    },
    [dispatch]
  );

  return {
    associateCheckout,
    checkoutId: cartState.checkoutId,
    customAttributes: cartState.customAttributes,
    discountCode: cartState.discountCode,
    id: cartState.id,
    itemCount,
    lineItemUpdate,
    lineItems,
    lineItemsSavingsPrice,
    lineItemsSubtotalPrice,
    rCheckoutId: cartState.rCheckoutId,
    replace,
    reset,
    setCustomAttributes,
    setDiscountCode,
    shippingThreshold,
    status,
  };
};

const saveCart = (state: CartState) => {
  store.set(
    "cart",
    sanitize({
      checkoutId: state.checkoutId,
      customAttributes: state.customAttributes,
      discountCode: state.discountCode,
      id: state.id,
      lineItems: state.lineItems,
      rCheckoutId: state.rCheckoutId,
      version: CART_STATE_VERSION,
    })
  );
};

const loadCart = (): StoredCartState | null => {
  const storedState = store.get("cart");

  if (typeof storedState === "object") {
    const { version, ...cartState } = storedState;

    if (version === CART_STATE_VERSION) {
      return { ...INITIAL_STATE, ...cartState };
    }

    store.remove("cart");
  }

  return null;
};
