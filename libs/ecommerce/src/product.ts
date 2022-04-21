import { captureException, captureMessage } from "@sentry/nextjs";
import { Locale } from "@sss/i18n";
import {
  add as addToDate,
  differenceInDays,
  isBefore as isBeforeDate,
  isValid as isValidDate,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { Decorator, FormApi } from "final-form";
import gql from "graphql-tag";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useRef } from "react";

import { isStringEnumMember } from "@/common/filters";

import type * as common from "./common";
import {
  getDiscount,
  getLegacyId,
  getOrderIntervalUnit,
  moneyFragment,
} from "./common";
import ECOMMERCE from "./config";

export interface Bottomline {
  averageScore: number;
  totalReviews: number;
}

export interface Image {
  height: number | null;
  id: string;
  url: string;
  width: number | null;
}

export interface Option {
  name: string;
  values: (string | number)[];
}

export interface PreorderAllocation {
  allocation: number;
  available: number;
  sold: number;
}

export enum PreorderType {
  NONE = "none",
  PURPLE_DOT = "purple_dot",
  SHOPIFY = "shopify",
}

export interface PriceRange {
  maxVariantPrice: common.Money;
  minVariantPrice: common.Money;
}

export interface Product extends ProductCore {
  availableForSale: boolean;
  bottomline: Bottomline | null;
  bundleUnit: common.Metafield | null;
  bundleUnitPlural: common.Metafield | null;
  caloriesPerUnit: common.Metafield | null;
  defaultSelectionSku: common.Metafield | null;
  defaultSelectionSubscription: common.Metafield | null;
  defaultVariantOrder: common.Metafield | null;
  description: string;
  images: common.Connection<Image>;
  listingSku: common.Metafield | null;
  listingSubscription: common.Metafield | null;
  listingSubtitle: common.Metafield | null;
  options: Option[];
  preorderShippingEstimate: common.Metafield | null;
  seo: { description: string; title: string };
  unit: common.Metafield | null;
  variants: common.Connection<Variant>;
}

export interface ProductContainer {
  compareAtPrice: common.Money | null;
  image: {
    height: number;
    id: string;
    url: string;
    width: number;
  } | null;
  price: common.Money;
  productId: string;
  title: string;
  variantId: string;
}

export enum ProductContainerOption {
  BASE = "base",
  UPGRADE = "upgrade",
}

export enum ProductContainerType {
  OTP = "otp",
  SUB = "sub",
}

export interface ProductContainers {
  [ProductContainerType.OTP]: {
    [ProductContainerOption.BASE]: ProductContainer | null;
    [ProductContainerOption.UPGRADE]: ProductContainer;
  };
  [ProductContainerType.SUB]: {
    [ProductContainerOption.BASE]: ProductContainer;
    [ProductContainerOption.UPGRADE]: ProductContainer | null;
  };
}

export interface ProductCore {
  containers: ProductContainers | null;
  featuredImage: common.Connection<{ src: string }>;
  handle: string;
  hasSubscription: common.Metafield | null;
  id: string;
  isSubscriptionOnly: common.Metafield | null;
  preorderType: common.Metafield | null;
  priceRange: PriceRange;
  productType: string;
  subscriptionFrequencies: common.Metafield | null;
  subscriptionUnit: common.Metafield | null;
  subtitle: common.Metafield | null;
  title: string;
  vendor: string;
}

export interface ProductData {
  product: Product;
}

export interface ProductFormValues {
  bumpOffer?: boolean;
  containerOptionOtp: ProductContainerOption | null;
  containerOptionSub: ProductContainerOption | null;
  frequency?: string;
  quantity: number;
  sku: string;
  subscription: string;
}

export interface ProductSelectionDefaults {
  frequency: string | null;
  listedSkus: string[];
  sku: string;
  subscription: boolean;
}

export interface ProductComputedMetadata {
  selection: ProductSelectionDefaults;
  subscription: ProductSubscriptionMetadata;
}

export interface PreorderMetadata {
  shippingEstimate: string | Date | null;
  type: PreorderType;
}

export type ProductCoreSubscriptionMetadata =
  | {
      hasSubscription: false;
      preorder: Pick<PreorderMetadata, "type">;
    }
  | {
      frequencies: string[];
      isSubscriptionOnly: boolean;
      hasSubscription: true;
      preorder: Pick<PreorderMetadata, "type">;
      unit: common.OrderIntervalUnit;
    };

export type ProductSubscriptionMetadata =
  | {
      hasSubscription: false;
      preorder: PreorderMetadata;
    }
  | {
      defaultFrequencies: Map<string, string>;
      frequencies: string[];
      isSubscriptionOnly: boolean;
      hasSubscription: true;
      preorder: PreorderMetadata;
      unit: common.OrderIntervalUnit;
    };

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Variant {
  availableForSale: boolean;
  barcode: string | null;
  bundleSize: common.Metafield | null;
  compareAtPriceV2: common.Money | null;
  defaultShippingIntervalFrequency: common.Metafield | null;
  id: string;
  image: Image;
  listingUsp: common.Metafield | null;
  priceV2: common.Money;
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  sku: string;
  subscriptionPriceAmount: common.Metafield | null;
  title: string;
  units: common.Metafield | null;
}

export interface VariantPrices {
  oneOffDiscount: common.Discount | null;
  oneOffPrice: common.Money;
  regularPrice: common.Money;
  subscriptionDiscount: common.Discount | null;
  subscriptionPrice: common.Money | null;
}

export interface VariantWithSelectionPrices extends VariantPrices {
  currentDiscount: common.Discount | null;
  currentPrice: common.Money;
}

const imageFragment = gql`
  fragment image on Image {
    height
    id
    url
    width
  }
`;

const productContainerFragment = gql`
  fragment productContainer on Container {
    compareAtPrice {
      ...money
    }
    id
    image {
      height
      id
      url
      width
    }
    price {
      ...money
    }
    productId
    title
    variantId
  }
  ${moneyFragment}
`;

const productContainerOptionsFragment = gql`
  fragment productContainerOptions on ContainerOptions {
    base {
      ...productContainer
    }
    upgrade {
      ...productContainer
    }
  }
  ${productContainerFragment}
`;

export const variantFragment = gql`
  fragment variant on ProductVariant {
    availableForSale
    barcode
    bundleSize: metafield(namespace: "bundle", key: "size") {
      id
      value
    }
    compareAtPriceV2 {
      ...money
    }
    defaultShippingIntervalFrequency: metafield(
      key: "default_shipping_interval_freq"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    id
    image {
      ...image
    }
    listingUsp: metafield(key: "usp", namespace: "listing") {
      id
      value
    }
    priceV2 {
      ...money
    }
    quantityAvailable
    selectedOptions {
      name
      value
    }
    sku
    subscriptionPriceAmount: metafield(
      key: "discount_variant_price"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    title
    units: metafield(key: "units", namespace: "global") {
      id
      value
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;

export const productCoreFragment = gql`
  fragment productCore on Product {
    containers {
      otp {
        ...productContainerOptions
      }
      sub {
        ...productContainerOptions
      }
    }
    featuredImage: images(first: 1) {
      edges {
        node {
          id
          src: transformedSrc(maxWidth: 1200)
        }
      }
    }
    handle
    hasSubscription: metafield(
      key: "has_subscription"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    id
    isSubscriptionOnly: metafield(
      key: "is_subscription_only"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    preorderType: metafield(namespace: "preorder", key: "type") {
      id
      value
    }
    priceRange {
      maxVariantPrice {
        ...money
      }
      minVariantPrice {
        ...money
      }
    }
    productType
    subscriptionFrequencies: metafield(
      key: "shipping_interval_frequency"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    subscriptionUnit: metafield(
      key: "shipping_interval_unit_type"
      namespace: "subscriptions"
    ) {
      id
      value
    }
    subtitle: metafield(namespace: "global", key: "subtitle") {
      id
      value
    }
    title
    vendor
  }
  ${moneyFragment}
  ${productContainerOptionsFragment}
`;

export const productFragment = gql`
  fragment product on Product {
    ...productCore
    availableForSale
    bottomline {
      averageScore
      totalReviews
    }
    bundleUnit: metafield(namespace: "bundle", key: "unit") {
      id
      value
    }
    bundleUnitPlural: metafield(namespace: "bundle", key: "unit_plural") {
      id
      value
    }
    caloriesPerUnit: metafield(namespace: "global", key: "calories_per_unit") {
      id
      value
    }
    defaultVariantOrder: metafield(
      key: "default_variant_order"
      namespace: "global"
    ) {
      id
      value
    }
    defaultSelectionSku: metafield(
      key: "default_selection_sku"
      namespace: "global"
    ) {
      id
      value
    }
    defaultSelectionSubscription: metafield(
      key: "default_selection_subscription"
      namespace: "global"
    ) {
      id
      value
    }
    description
    images(first: 6) {
      edges {
        node {
          ...image
        }
      }
    }
    listingSku: metafield(key: "sku", namespace: "listing") {
      id
      value
    }
    listingSubscription: metafield(key: "subscription", namespace: "listing") {
      id
      value
    }
    listingSubtitle: metafield(key: "subtitle", namespace: "listing") {
      id
      value
    }
    options(first: 1) {
      id
      name
      values
    }
    preorderShippingEstimate: metafield(
      namespace: "preorder"
      key: "shipping_estimate"
    ) {
      id
      value
    }
    priceRange {
      maxVariantPrice {
        ...money
      }
      minVariantPrice {
        ...money
      }
    }
    seo {
      title
      description
    }
    unit: metafield(key: "unit", namespace: "global") {
      id
      value
    }
    variants(first: 5) {
      edges {
        node {
          ...variant
        }
      }
    }
  }
  ${imageFragment}
  ${productCoreFragment}
  ${variantFragment}
  ${moneyFragment}
`;

export const PRODUCT_BY_HANDLE = gql`
  query PRODUCT_BY_HANDLE($handle: String!) {
    product: productByHandle(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const PRODUCTS = gql`
  query PRODUCTS($ids: [ID!]!) {
    products: sNodes(ids: $ids) {
      ... on Product {
        ...product
      }
    }
  }
  ${productFragment}
`;

export const findBundleQuantity = (selectedOptions: SelectedOption[]) => {
  const bundleSizeOption = selectedOptions.find(
    ({ name }) => name === "Bundle size"
  );

  if (!bundleSizeOption) {
    return null;
  }

  const bundleSize = parseInt(bundleSizeOption.value);

  if (isNaN(bundleSize)) {
    return null;
  }

  return bundleSize;
};

const findMinPrice = (prices: common.Money[]) => {
  if (!prices.length) throw new Error("At least one price must be provided");

  return prices.reduce((min, compare) =>
    !compare || Number(compare.amount) >= Number(min.amount) ? min : compare
  );
};

export const findFromPrice = ({ edges }: common.Connection<Variant>) => {
  return findMinPrice(
    edges.map(
      ({ node: { compareAtPriceV2, priceV2, subscriptionPriceAmount } }) => {
        const prices = [priceV2];

        if (compareAtPriceV2) {
          prices.push(compareAtPriceV2);
        }

        if (ECOMMERCE.subscriptions && subscriptionPriceAmount) {
          prices.push({
            amount: subscriptionPriceAmount.value,
            currencyCode: priceV2.currencyCode, // Use the currency code from `priceV2` as we don't get one from the metadata
          });
        }

        return findMinPrice(prices);
      }
    )
  );
};

export const findVariantById = <T extends Variant>(
  { edges }: common.Connection<T>,
  id: string
): T | undefined => {
  const edge = edges.find(({ node }) => node.id === id);

  if (edge) {
    return edge.node;
  }
};

export const findVariantByLegacyId = <T extends Variant>(
  { edges }: common.Connection<T>,
  id: string
): T | undefined => {
  const edge = edges.find(({ node }) => getLegacyId(node.id) === id);

  if (edge) {
    return edge.node;
  }
};

export const findVariantBySku = <T extends Variant>(
  { edges }: common.Connection<T>,
  sku: string
): T | undefined => {
  const edge = edges.find(({ node }) => node.sku === sku);

  if (edge) {
    return edge.node;
  }
};

export const findDefaultVariant = <T extends Variant>({
  edges,
}: common.Connection<T>): T => {
  let edge = edges.find(({ node }) => node.title === "Default Title");

  if (!edge) {
    edge = edges[0];
  }

  return edge.node;
};

export const findDiscount = ({ compareAtPriceV2, priceV2 }: Variant) => {
  const discount = Number(compareAtPriceV2?.amount) - Number(priceV2.amount);
  return {
    amount: discount.toString(),
    currencyCode: priceV2.currencyCode,
  };
};

export const findProductContainer = (
  containers: ProductContainers | null,
  type: ProductContainerType,
  option: ProductContainerOption | null
): ProductContainer | null => containers && option && containers[type][option];

export const findProductContainerFromFormValues = (
  containers: ProductContainers | null,
  values: ProductFormValues
): ProductContainer | null => {
  const subscription = values.subscription === "True";
  const type = subscription
    ? ProductContainerType.SUB
    : ProductContainerType.OTP;
  const option = subscription
    ? values.containerOptionSub
    : values.containerOptionOtp;

  return findProductContainer(containers, type, option);
};

export const formValuesToFrequency = (
  values: ProductFormValues,
  meta: ProductComputedMetadata
) => {
  if (
    !meta.subscription.hasSubscription ||
    values.subscription !== "True" ||
    !values.frequency
  ) {
    return null;
  }

  const orderIntervalFrequency = parseInt(values.frequency);
  const orderIntervalUnit = meta.subscription.unit;
  return {
    chargeDelayDays: meta.subscription.preorder.shippingEstimate
      ? calculateChargeDelayDays(
          orderIntervalFrequency,
          orderIntervalUnit,
          meta.subscription.preorder.shippingEstimate
        )
      : null,
    orderIntervalFrequency,
    orderIntervalUnit,
  };
};

export const getInitialProductFormValues = (
  { frequency, sku, subscription }: ProductSelectionDefaults,
  containers: ProductContainers | null
): Partial<ProductFormValues> => ({
  containerOptionOtp:
    (containers?.[ProductContainerType.OTP][ProductContainerOption.BASE] &&
      ProductContainerOption.BASE) ??
    null,
  containerOptionSub: containers && ProductContainerOption.BASE,
  frequency: frequency ?? undefined,
  quantity: 1,
  sku,
  subscription: subscription ? "True" : "False",
});

export const getPreorderAllocation = (
  variant: Variant
): PreorderAllocation | null => {
  const inventory = variant.quantityAvailable;
  const isOutOfStock = inventory < 1;

  if (!isOutOfStock) return null;

  // We "release" every 250 units.
  const allocationSize = 250;
  // If we get within 20 of the next allocation, we release.
  const allocationThreshold = 20;

  const sold = Math.abs(inventory);
  let allocation =
    Math.ceil(Math.max(sold, 1) / allocationSize) * allocationSize;
  allocation =
    sold + allocationThreshold > allocation
      ? allocation + allocationSize
      : allocation;

  return {
    allocation,
    available: allocation - sold,
    sold,
  };
};

export const getProductImages = (product: Product) => {
  const variantImageIds = new Set(
    product.variants.edges.map(
      ({
        node: {
          image: { id },
        },
      }) => id
    )
  );

  return product.images.edges.reduce<Image[]>(
    (accum, { node }, index) =>
      // Return the first image (as this is the default image for variants),
      // along with any images that are not assigned to variants
      index === 0 || !variantImageIds.has(node.id) ? [...accum, node] : accum,
    []
  );
};

export const getProductCoreSubscriptionMetadata = (
  product: ProductCore,
  query: ParsedUrlQuery
): ProductCoreSubscriptionMetadata => {
  const preorderType = parsePreorderTypeMetafield(product.preorderType);

  const hasSubscription =
    ECOMMERCE.subscriptions &&
    preorderType !== PreorderType.PURPLE_DOT &&
    product.hasSubscription?.value?.toLowerCase() === "true" &&
    // Allow `hasSubscription` to be disabled (but not enabled) via query
    (typeof query.has_subscription !== "string" ||
      query.has_subscription?.toLowerCase() !== "false");

  if (!hasSubscription) {
    return {
      hasSubscription,
      preorder: { type: preorderType },
    };
  }

  const frequencies = product.subscriptionFrequencies?.value.split(",");
  const isSubscriptionOnly =
    hasSubscription &&
    (product.isSubscriptionOnly?.value?.toLowerCase() === "true" ||
      // Allow `isSubscriptionOnly` to be enabled (but not disabled) via query
      (typeof query.is_subscription_only === "string" &&
        query.is_subscription_only?.toLowerCase() === "true"));
  const unit =
    product.subscriptionUnit?.value &&
    getOrderIntervalUnit(product.subscriptionUnit?.value);

  if (!frequencies?.length || !unit) {
    throw new Error("Invalid subscription metafields");
  }

  return {
    frequencies,
    hasSubscription,
    isSubscriptionOnly,
    preorder: { type: preorderType },
    unit,
  };
};

export const getProductSubscriptionMetadata = (
  product: Product,
  query: ParsedUrlQuery,
  locale: Pick<Locale, "timeZone">
): ProductSubscriptionMetadata => {
  const productCoreMetadata = getProductCoreSubscriptionMetadata(
    product,
    query
  );

  let shippingEstimate: Date | null = null;
  try {
    if (product.preorderShippingEstimate?.value) {
      shippingEstimate = zonedTimeToUtc(
        product.preorderShippingEstimate.value,
        locale.timeZone
      );

      if (shippingEstimate && !isValidDate(shippingEstimate)) {
        shippingEstimate = null;
        throw new Error(
          `Invalid preorder date string "${product.preorderShippingEstimate.value}". Expected format YYYY-MM-DD.`
        );
      }

      if (shippingEstimate && isBeforeDate(shippingEstimate, new Date())) {
        shippingEstimate = null;
        captureMessage(
          `${product.handle} has a shipping estimate in the past.`
        );
      }
    }
  } catch (error) {
    // Failed to parse. Bad setup, capture it in Sentry.
    captureException(error);
  }

  const preorder: PreorderMetadata = {
    ...productCoreMetadata.preorder,
    shippingEstimate,
  };

  if (!productCoreMetadata.hasSubscription) {
    return {
      ...productCoreMetadata,
      preorder,
    };
  }

  const defaultFrequencies = new Map(
    product.variants.edges.map(({ node }) => [
      node.sku,
      node.defaultShippingIntervalFrequency?.value ??
        productCoreMetadata.frequencies[0],
    ])
  );
  return {
    ...productCoreMetadata,
    defaultFrequencies,
    preorder,
  };
};

export const useProductSelectionDecorator = (
  meta: ProductComputedMetadata
): Decorator<ProductFormValues> => {
  const metaRef = useRef(meta);

  // Update ref every render to make sure we have access to the current value
  metaRef.current = meta;

  // Wrap the decorator in a zero-dependency `useCallback` hook so it doesn't
  // change while the form is mounted
  return useCallback(
    (form: FormApi<ProductFormValues>) =>
      form.subscribe(
        ({ active, touched, values }) => {
          // Update the default frequency for each variant
          if (active === "sku" && !touched?.frequency) {
            const { subscription } = metaRef.current;

            const frequency =
              subscription.hasSubscription &&
              subscription.defaultFrequencies.get(values.sku);

            if (frequency) {
              form.change("frequency", frequency);
            }
          }
        },
        {
          active: true,
          touched: true,
          values: true,
        }
      ),
    []
  );
};

export const getProductVariantList = (product: Product) => {
  const allSkus = product.variants.edges.map(({ node }) => node.sku);

  let listedSkus =
    product.defaultVariantOrder?.value?.split(",").map((str) => str.trim()) ??
    null;

  if (listedSkus?.some((sku) => !allSkus.includes(sku))) {
    const error = new Error(`Invalid product metafield: "global:default_variant_order".
    Allowed values: ${allSkus.join(", ")}
    Received: ${product.defaultVariantOrder?.value}`);

    if (process.env.NODE_ENV === "production") {
      captureException(error);
    } else {
      throw error;
    }

    listedSkus = null;
  }

  if (!listedSkus) {
    listedSkus = allSkus;
  }

  return listedSkus;
};

export const getProductVariants = (product: Product) =>
  getProductVariantList(product).map(
    // We validate the SKUs within `getProductVariantList`, so we're guaranteed
    // to receive a variant
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (sku) => findVariantBySku(product.variants, sku)!
  );

export const getProductSelectionDefaults = (
  product: Product,
  query: ParsedUrlQuery,
  subscriptionMetadata: ProductSubscriptionMetadata
): ProductSelectionDefaults => {
  const listedSkus = getProductVariantList(product);

  const skuFromQueryVariant =
    (typeof query.variant === "string" &&
      findVariantByLegacyId(product.variants, query.variant)?.sku) ||
    null;
  const skuFromQuery = (typeof query.sku === "string" && query.sku) || null;
  const skuFromDefaultSelection = product.defaultSelectionSku?.value ?? null;

  const sku =
    [skuFromQueryVariant, skuFromQuery, skuFromDefaultSelection].find(
      (sku) => !!sku && listedSkus?.includes(sku)
    ) ?? listedSkus[0];

  const subscription =
    subscriptionMetadata.hasSubscription &&
    (product.defaultSelectionSubscription?.value !== "false"
      ? query.subscription !== "false"
      : query.subscription === "true");

  let frequency: string | null = null;

  if (
    typeof query.frequency === "string" &&
    "frequencies" in subscriptionMetadata &&
    subscriptionMetadata.frequencies.includes(query.frequency)
  ) {
    frequency = query.frequency;
  } else if (subscriptionMetadata.hasSubscription) {
    frequency =
      subscriptionMetadata.defaultFrequencies?.get(sku) ??
      subscriptionMetadata.frequencies[0];
  }

  return {
    frequency,
    listedSkus,
    sku,
    subscription,
  };
};

export const getProductComputedMetadata = (
  product: Product,
  query: ParsedUrlQuery,
  locale: Pick<Locale, "timeZone">
): ProductComputedMetadata => {
  const subscription = getProductSubscriptionMetadata(product, query, locale);

  const selection = getProductSelectionDefaults(product, query, subscription);

  return { selection, subscription };
};

export const getVariantPrices: {
  (variant: Variant): VariantPrices;
  (
    variant: Variant,
    isSubscriptionSelected: boolean
  ): VariantWithSelectionPrices;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = (variant: Variant, isSubscriptionSelected?: boolean): any => {
  const regularPrice = variant.compareAtPriceV2 || variant.priceV2;

  const oneOffPrice = variant.priceV2;

  const subscriptionPrice: common.Money | null = variant.subscriptionPriceAmount && {
    ...variant.priceV2,
    amount: variant.subscriptionPriceAmount.value,
  };

  const oneOffDiscount = getDiscount(oneOffPrice, regularPrice);
  const subscriptionDiscount =
    subscriptionPrice && getDiscount(subscriptionPrice, regularPrice);

  const result: VariantPrices = {
    oneOffDiscount,
    oneOffPrice,
    regularPrice,
    subscriptionDiscount,
    subscriptionPrice,
  };

  if (typeof isSubscriptionSelected === "undefined") {
    return result;
  }

  const currentPrice =
    subscriptionPrice && isSubscriptionSelected
      ? subscriptionPrice
      : oneOffPrice;

  const currentDiscount = getDiscount(currentPrice, regularPrice);

  return {
    ...result,
    currentDiscount,
    currentPrice,
  };
};

export const getMaxPercentageDiscount = (
  product: Product,
  query: ParsedUrlQuery,
  locale: Pick<Locale, "timeZone">
) => {
  const subscriptionMeta = getProductSubscriptionMetadata(
    product,
    query,
    locale
  );

  return product.variants.edges.reduce<number | null>(
    (accum, { node: variant }) => {
      const { oneOffDiscount, subscriptionDiscount } = getVariantPrices(
        variant,
        true
      );

      const discounts = subscriptionMeta.hasSubscription
        ? [oneOffDiscount, subscriptionDiscount]
        : [oneOffDiscount];

      let maxDiscount = accum;

      discounts.forEach((discount) => {
        if (discount && (!maxDiscount || discount.percentage > maxDiscount)) {
          maxDiscount = discount.percentage;
        }
      });

      return maxDiscount;
    },
    null
  );
};

export const isDefaultFrequency = (
  { subscription }: ProductComputedMetadata,
  sku: string,
  value: string
): boolean =>
  subscription.hasSubscription &&
  subscription.defaultFrequencies.get(sku) == value;

/**
 * Given a `frequency`, `unit` and `shippingEstimate`, calculate the number
 * of days to delay the first charge by. This is used for pre-order subscriptions.
 *
 * Note: As recharge deals in days, a recovered abandoned cart might be over-delayed.
 */
export const calculateChargeDelayDays = (
  frequency: number,
  unit: common.OrderIntervalUnit,
  shippingEstimate: Date | string
) => {
  const date =
    typeof shippingEstimate === "string"
      ? new Date(shippingEstimate)
      : shippingEstimate;
  const firstRecurringChargeDate = addToDate(date, {
    days: unit === "DAY" ? frequency : 0,
    hours: 0,
    minutes: 0,
    months: unit === "MONTH" ? frequency : 0,
    seconds: 0,
    weeks: unit === "WEEK" ? frequency : 0,
    years: 0,
  });

  const diff = differenceInDays(firstRecurringChargeDate, new Date());
  return diff > 0 ? diff : null;
};

export const getProductUrl = ({ handle }: Pick<Product, "handle">) =>
  `${ECOMMERCE.origin}/products/${handle}`;

export const parsePreorderTypeMetafield = (
  metafield: common.Metafield | null
): PreorderType => {
  const preorderType = metafield?.value?.toLowerCase();

  return preorderType && isStringEnumMember(PreorderType, preorderType)
    ? preorderType
    : PreorderType.NONE;
};
