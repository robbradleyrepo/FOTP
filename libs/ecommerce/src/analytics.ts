import {
  AddToCartEvent,
  CheckoutStepEvent,
  dataLayerTrack,
  getCapturedTrackingParams,
  gidToId,
  Product as DLProduct,
  PurchaseEvent,
  RemoveFromCartEvent,
  SelectItemEvent,
  ViewCartEvent,
  ViewItemEvent,
  ViewItemListEvent,
} from "@sss/analytics";
import Cookies from "js-cookie";
import { v4 as uuid } from "uuid";

import { EnhancedCartLineItem } from "./cart";
import { Checkout as ReChargeCheckout } from "./checkout";
import { Money, moneyFns } from "./common";
import { Frequency } from "./common";
import {
  getProductUrl,
  parsePreorderTypeMetafield,
  PreorderType,
  Product,
  ProductCore,
  Variant,
} from "./product";

export const mapCheckoutToCheckoutStep = ({
  checkout,
  event,
  step,
}: {
  checkout: ReChargeCheckout;
  event: CheckoutStepEvent["event"];
  step: CheckoutStepEvent["ecommerce"]["checkout"]["actionField"]["step"];
}): CheckoutStepEvent => {
  const products: DLProduct[] = checkout.lineItems.map((item, idx) => ({
    brand: item.vendor,
    // We do not have the productType in the context
    category: "",
    id: item.sku,
    image: item.image,
    name: item.title,
    position: idx + 1,
    price: item.price.amount,
    product_id: gidToId(item.productId),
    purchase_type: item.frequency ? "subscribe" : "one time",
    quantity: item.quantity,
    variant:
      item.variantTitle && item.variantTitle !== "Default Title"
        ? item.variantTitle
        : "",
    variant_id: gidToId(item.variantId),
    ...(item.frequency
      ? {
          interval_frequency: item.frequency.orderIntervalFrequency,
          interval_unit: item.frequency.orderIntervalUnit,
        }
      : undefined),
  }));
  return {
    cart_id: checkout.id ?? undefined,
    cart_total: checkout.totalPrice.amount,
    ecommerce: {
      checkout: {
        actionField: {
          step,
        },
        products,
      },
      currencyCode: "USD",
    },
    event,
    purchase_type: products.some((i) => i.purchase_type === "subscribe")
      ? "subscribe"
      : "one time",
  };
};

export const mapProductToDataLayer = (
  product: ProductCore | Product
): DLProduct => ({
  brand: product.vendor,
  category: product.productType,
  compare_at_price: "",
  handle: product.handle,
  // id should be empty as there's no variant
  id: "",
  image: product.featuredImage.edges?.[0]?.node?.src ?? "",
  is_preorder:
    parsePreorderTypeMetafield(product.preorderType) !== PreorderType.NONE,
  name: product.title,
  price: product.priceRange.minVariantPrice.amount,
  product_id: gidToId(product.id),
  product_url: getProductUrl({ handle: product.handle }),
  // These should be empty as there's no variant
  variant: "",
  variant_id: "",
});

type VariantCore = Pick<
  Variant,
  "barcode" | "compareAtPriceV2" | "id" | "image" | "priceV2" | "sku" | "title"
>;

export const mapProductVariantToDataLayer = (
  product: ProductCore | Product,
  variant: VariantCore,
  frequency?: Frequency | null
): DLProduct => {
  const dlProduct = mapProductToDataLayer(product);
  return {
    ...dlProduct,
    compare_at_price: variant.compareAtPriceV2?.amount ?? "",
    id: variant.sku,
    image: variant?.image?.url ?? dlProduct.image,
    ...(frequency
      ? {
          interval_frequency: frequency.orderIntervalFrequency,
          interval_unit: frequency.orderIntervalUnit,
        }
      : undefined),
    ...(variant.barcode !== null
      ? {
          gtin: variant.barcode,
        }
      : undefined),
    price: variant.priceV2.amount,
    purchase_type: frequency ? "subscribe" : "one time",
    // Override the variant values unless we're the default variant (silly Shopify)
    ...(variant.title !== "Default Title"
      ? {
          // XXX: Not sure why the Spec strips '
          variant: variant.title.replace("'", ""),
          variant_id: gidToId(variant.id),
        }
      : undefined),
  };
};

export const mapCartLineItemToDataLayer = (
  item: EnhancedCartLineItem,
  position: number
): DLProduct => ({
  ...mapProductVariantToDataLayer(
    item.variant.product,
    item.variant,
    item.frequency
  ),
  position,
  price: item.linePrice.amount,
  quantity: item.quantity,
});

export const trackViewItemListEvent = (products: ProductCore[], list: string) =>
  dataLayerTrack<ViewItemListEvent>({
    ecommerce: {
      currencyCode: "USD",
      impressions: products.map((item, position) => ({
        ...mapProductToDataLayer(item),
        list,
        position,
      })),
    },
    event: "dl_view_item_list",
  });

export const trackSelectItemEvent = (
  product: ProductCore,
  list: string,
  position?: number
) =>
  dataLayerTrack<SelectItemEvent>({
    ecommerce: {
      click: {
        actionField: {
          list,
          products: [
            {
              ...mapProductToDataLayer(product),
              list,
              ...(position ? { position } : undefined),
            },
          ],
        },
      },
      currencyCode: "USD",
    },
    event: "dl_select_item",
  });

export const trackViewItemEvent = (
  product: ProductCore,
  variant: VariantCore,
  source: string,
  frequency?: Frequency | null
) =>
  dataLayerTrack<ViewItemEvent>({
    ecommerce: {
      currencyCode: "USD",
      detail: {
        products: [
          {
            ...mapProductVariantToDataLayer(product, variant, frequency),
          },
        ],
      },
    },
    event: "dl_view_item",
    source,
  });

export const trackViewCartEvent = (
  cartId: string | null,
  subtotalPrice: Money,
  lineItems: EnhancedCartLineItem[]
) => {
  const impressions = lineItems.map(mapCartLineItemToDataLayer);
  dataLayerTrack<ViewCartEvent>({
    cart_id: cartId ?? undefined,
    cart_total: subtotalPrice.amount,
    ecommerce: {
      actionField: {
        list: "Shopping Cart",
      },
      currencyCode: "USD",
      impressions,
    },
    event: "dl_view_cart",
    is_preorder: impressions.some((i) => i.is_preorder),
    purchase_type: impressions.some((i) => i.purchase_type === "subscribe")
      ? "subscribe"
      : "one time",
  });
};

export const trackAddToCartEvent = (
  product: ProductCore,
  variant: VariantCore,
  source: string,
  quantity: number,
  frequency?: Frequency | null
) =>
  dataLayerTrack<AddToCartEvent>({
    ecommerce: {
      add: {
        products: [
          {
            ...mapProductVariantToDataLayer(product, variant, frequency),
            quantity,
          },
        ],
      },
      currencyCode: "USD",
    },
    event: "dl_add_to_cart",
    source,
  });

export const trackRemoveFromCartEvent = (
  product: ProductCore,
  variant: VariantCore,
  source: string,
  quantity: number,
  frequency?: Frequency | null
) =>
  dataLayerTrack<RemoveFromCartEvent>({
    ecommerce: {
      currencyCode: "USD",
      remove: {
        products: [
          {
            ...mapProductVariantToDataLayer(product, variant, frequency),
            quantity,
          },
        ],
      },
    },
    event: "dl_remove_from_cart",
    source,
  });

export const trackBeginCheckoutEvent = (checkout: ReChargeCheckout) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapCheckoutToCheckoutStep({
      checkout,
      event: "dl_begin_checkout",
      step: "1",
    })
  );

export const trackAddShippingInfoEvent = (checkout: ReChargeCheckout) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapCheckoutToCheckoutStep({
      checkout,
      event: "dl_add_shipping_info",
      step: "2",
    })
  );

export const trackAddPaymentInfoEvent = (checkout: ReChargeCheckout) =>
  dataLayerTrack<CheckoutStepEvent>(
    mapCheckoutToCheckoutStep({
      checkout,
      event: "dl_add_payment_info",
      step: "3",
    })
  );

export const trackPurchaseEvent = (
  checkout: ReChargeCheckout,
  affiliation: string
) => {
  checkout.rOrders?.forEach((order) => {
    const subtotal = moneyFns.subtract(
      order.totalPrice,
      moneyFns.add(order.totalTax, order.totalShipping)
    );
    dataLayerTrack<PurchaseEvent>({
      ecommerce: {
        currencyCode: "USD",
        purchase: {
          actionField: {
            affiliation,
            discount_amount: checkout.totalDiscounts.amount,
            id: order.orderNumber.toString(),
            order_name: `#${order.orderNumber}`,
            revenue: checkout.totalPrice.amount,
            shipping: checkout.shippingRate?.price.amount ?? "0",
            sub_total: subtotal.amount,
            tax: checkout.totalTax.amount,
          },
          products: order.lineItems.map(
            (item, position): DLProduct => {
              // The ReCharge order line item is missing `productType` and `vendor`,
              // we find the checkout line item with the same id and use that.
              const lineItem = checkout.lineItems.find(
                (i) => item.variantId === i.variantId
              );
              return {
                brand: lineItem?.vendor ?? "",
                category: lineItem?.productType ?? "",
                // XXX: We do not have preorder available in this context
                // is_preorder,
                id: item.sku,
                image: item.image,
                name: item.title,
                position,
                price: item.price.amount,
                product_id: gidToId(item.productId),
                purchase_type: item.frequency ? "subscribe" : "one time",
                quantity: item.quantity,
                variant: item.variantTitle?.replace?.("'", "") ?? "",
                variant_id: item.variantId,
                ...(item.frequency
                  ? {
                      interval_frequency: item.frequency.orderIntervalFrequency,
                      interval_unit: item.frequency.orderIntervalUnit,
                    }
                  : undefined),
              };
            }
          ),
        },
      },
      event: "dl_purchase",
      // XXX: We do not have preorder available in this context
      // is_preorder: true,
      purchase_type: "subscribe",

      user_properties:
        checkout.email && checkout.customer?.analyticsUserId
          ? {
              customer_city:
                checkout.billingAddress?.city ?? checkout.shippingAddress?.city,
              customer_country_code:
                checkout.billingAddress?.countryCode ??
                checkout.shippingAddress?.countryCode,
              customer_email: checkout.email,
              customer_first_name:
                checkout.billingAddress?.firstName ??
                checkout.shippingAddress?.firstName,
              customer_id: checkout.customer.analyticsUserId,
              customer_last_name:
                checkout.billingAddress?.lastName ??
                checkout.shippingAddress?.lastName,
              customer_phone: checkout.shippingAddress?.phone || "",
              customer_province_code:
                checkout.billingAddress?.province ??
                checkout.shippingAddress?.province,
              customer_tags: "",
              customer_zip:
                checkout.billingAddress?.zip ?? checkout.shippingAddress?.zip,
              // TODO: CCPA hardcoded
              user_consent: "yes",
              visitor_type: "logged_in",
            }
          : {
              // TODO: CCPA hardcoded
              user_consent: "yes",
              visitor_type: "guest",
            },
    });
  });
};

const getGaClientId = (): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return resolve(undefined);
    }

    // On some browsers + ad blocker combos,
    // accessing `ga` may never resolve.
    const timeoutId = setTimeout(() => reject(new Error("Timeout")), 50);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ga = (window as any).ga;
      if (!ga) {
        clearTimeout(timeoutId);
        resolve(undefined);
      } else {
        ga(() => {
          const tracker = ga.getAll()?.[0];
          if (!tracker) {
            clearTimeout(timeoutId);
            reject(undefined);
          } else {
            const clientId = tracker.get("clientId");
            clearTimeout(timeoutId);
            resolve(clientId);
          }
        });
      }
    } catch (err) {
      clearTimeout(timeoutId);
      reject(err);
    }
  });

const getFallbackId = async () => {
  let fallback = Cookies.get("_fallback_id");
  if (!fallback) {
    fallback = uuid();
    try {
      Cookies.set("_fallback_id", fallback);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }

  return fallback;
};

export const getTrackingAttributes = async (): Promise<
  Record<string, string>
> => {
  if (typeof window === "undefined") {
    return {};
  }

  const attributes: Record<string, string> = {};

  // Amplitude
  const deviceId =
    (window as any).amplitude?.getInstance?.().options?.deviceId ?? // eslint-disable-line @typescript-eslint/no-explicit-any
    (await getFallbackId());
  if (deviceId) {
    attributes.deviceId = deviceId;
  }

  // For our own server side GA we use the client ID without the version.
  let gaClientId: string | undefined;
  try {
    gaClientId = (await getGaClientId()) ?? (await getFallbackId());
  } catch (err) {
    gaClientId = await getFallbackId();
  }
  if (gaClientId) {
    attributes.gaClientId = gaClientId;
  }

  // Elevar uses these for server side tracking
  for (const name of ["_fbc", "_fbp", "_ga"]) {
    const value = Cookies.get(name);
    if (value) {
      attributes[`_elevar_${name}`] = value;
    }
  }

  const captured = getCapturedTrackingParams();
  if (Object.keys(captured).length > 0) {
    attributes._elevar_visitor_info = JSON.stringify(captured);
  }

  return attributes;
};
