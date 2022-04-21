import { MockedResponse } from "@apollo/react-testing";

import { PRODUCT_BY_HANDLE } from "../../product";

export const variant = {
  __typename: "ProductVariant",
  availableForSale: true,
  barcode: "123",
  bundleSize: null,
  compareAtPriceV2: {
    __typename: "MoneyV2",
    amount: "39.99",
    currencyCode: "USD",
  },
  defaultShippingIntervalFrequency: {
    __typename: "Metafield",
    id: "defaultShippingIntervalFrequency-1",
    value: "1",
  },
  id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
  image: {
    __typename: "Image",
    height: 1000,
    id: "4",
    url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
    width: 1000,
  },
  listingUsp: null,
  priceV2: {
    __typename: "MoneyV2",
    amount: "34.99",
    currencyCode: "USD",
  },
  quantityAvailable: 10,
  selectedOptions: [
    {
      __typename: "SelectedOption",
      name: "Title",
      value: "Default Title",
    },
  ],
  sku: "move",
  subscriptionPriceAmount: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTI5ODIzNzg3NTgyMjI=",
    value: "29.99",
  },
  title: "Default Title",
  units: {
    __typename: "Metafield",
    id: "gid://shopify/Metafield/1",
    value: "60",
  },
};

export const productCoreTheOne = {
  __typename: "Product",
  containers: null,
  description: "Eight essential benefits in one",
  featuredImage: {
    __typename: "ImageConnection",
    edges: [
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMTQ2NTA0MTA1MDAxNzQ=",
          src: "https://cdn.shopify.com/mock-image/product-1.jpg",
        },
      },
    ],
  },
  handle: "the-one",
  hasSubscription: null,
  id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE=",
  isSubscriptionOnly: null,
  preorderType: null,
  priceRange: {
    __typename: "ProductPriceRange",
    maxVariantPrice: {
      __typename: "MoneyV2",
      amount: "101.1",
      currencyCode: "USD",
    },
    minVariantPrice: {
      __typename: "MoneyV2",
      amount: "38.19",
      currencyCode: "USD",
    },
  },
  productType: "",
  subscriptionFrequencies: null,
  subscriptionUnit: null,
  subtitle: {
    __typename: "Metafield",
    id: "metafield-subtitle-the-one",
    value: "Eight essential benefits in one",
  },
  title: "The One",
  unit: null,
  vendor: "Front Of The Pack",
};

export const productCoreMove = {
  __typename: "Product",
  containers: null,
  description: "Targeted joint and mobility support",
  featuredImage: {
    __typename: "ImageConnection",
    edges: [
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          id: "1",
          src: "https://cdn.shopify.com/mock-image/product-1.jpg",
        },
      },
    ],
  },
  handle: "move",
  hasSubscription: null,
  id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1MzU1Mzc1MzMwMDY=",
  isSubscriptionOnly: null,
  preorderType: null,
  priceRange: {
    __typename: "ProductPriceRange",
    maxVariantPrice: {
      __typename: "MoneyV2",
      amount: "95.98",
      currencyCode: "USD",
    },
    minVariantPrice: {
      __typename: "MoneyV2",
      amount: "35.99",
      currencyCode: "USD",
    },
  },
  productType: "Pet Vitamins & Supplements",
  subscriptionFrequencies: null,
  subscriptionUnit: null,
  subtitle: {
    __typename: "Metafield",
    id: "metafield-subtitle-move",
    value: "Targeted joint and mobility support",
  },
  title: "Move",
  unit: null,
  vendor: "Front Of The Pack",
};

export const productFragment = {
  ...productCoreMove,
  availableForSale: true,
  bottomline: {
    __typename: "ReviewBottomline",
    averageScore: 4.5,
    totalReviews: 2,
  },
  bundleUnit: null,
  bundleUnitPlural: null,
  caloriesPerUnit: null,
  compareAtPriceV2: null,
  defaultSelectionSku: null,
  defaultSelectionSubscription: null,
  defaultVariantOrder: null,
  description: "Targeted joint and mobility support",
  id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1MzU1Mzc1MzMwMDY=",
  images: {
    __typename: "ImageConnection",
    edges: [
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          height: 1000,
          id: "1",
          url: "https://cdn.shopify.com/mock-image/product-1.jpg",
          width: 1000,
        },
      },
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          height: 1000,
          id: "2",
          url: "https://cdn.shopify.com/mock-image/product-2.jpg",
          width: 1000,
        },
      },
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          height: 1000,
          id: "3",
          url: "https://cdn.shopify.com/mock-image/product-3.jpg",
          width: 1000,
        },
      },
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          height: 1000,
          id: "4",
          url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
          width: 1000,
        },
      },
    ],
  },
  listingSku: null,
  listingSubscription: null,
  listingSubtitle: null,
  options: [
    {
      __typename: "ProductOption",
      id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzU4NzMxNjM4NjIwOTQ=",
      name: "Title",
      values: ["Default Title"],
    },
  ],
  preorderShippingEstimate: null,
  preorderType: null,
  seo: { description: "", title: "" },
  totalInventory: 1000,
  unit: null,
  variants: {
    __typename: "ProductVariantConnection",
    edges: [
      {
        __typename: "ProductVariantEdge",
        node: variant,
      },
    ],
  },
};

const productFood = {
  __typename: "Product",
  availableForSale: true,
  bottomline: null,
  bundleUnit: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk5MDk3ODQyNDAyMDY=",
    value: "bag",
  },
  bundleUnitPlural: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk5MDk3ODQyNzI5NzQ=",
    value: "bags",
  },
  caloriesPerUnit: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk5NTM0NTA1ODIwOTQ=",
    value: "2500",
  },
  containers: null,
  defaultSelectionSku: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NTkyMTY3MjgxNDI=",
    value: "ckn",
  },
  defaultSelectionSubscription: null,
  defaultVariantOrder: null,
  description: "",
  featuredImage: {
    __typename: "ImageConnection",
    edges: [
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg3Mjg2ODU5ODU4NzA=",
          src:
            "https://cdn.shopify.com/s/files/1/0266/2825/9918/products/food-placeholder_1200x.png?v=1637064456",
        },
      },
    ],
  },
  handle: "chicken",
  hasSubscription: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMTMxNDc3MjY=",
    value: "True",
  },
  id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2NjY1NjQ3NjM3MjY=",
  images: {
    __typename: "ImageConnection",
    edges: [
      {
        __typename: "ImageEdge",
        node: {
          __typename: "Image",
          height: 2400,
          id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg3Mjg2ODU5ODU4NzA=",
          url:
            "https://cdn.shopify.com/s/files/1/0266/2825/9918/products/food-placeholder.png?v=1637064456",
          width: 2400,
        },
      },
    ],
  },
  isSubscriptionOnly: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMTMzNDQzMzQ=",
    value: "false",
  },
  listingSku: null,
  listingSubscription: null,
  listingSubtitle: null,
  options: [
    {
      __typename: "ProductOption",
      id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzg1NTE1NjYxODA0MzA=",
      name: "Size",
      values: ["2.5 lbs"],
    },
  ],
  preorderShippingEstimate: null,
  preorderType: null,
  priceRange: {
    __typename: "ProductPriceRange",
    maxVariantPrice: {
      __typename: "MoneyV2",
      amount: "49.99",
      currencyCode: "USD",
    },
    minVariantPrice: {
      __typename: "MoneyV2",
      amount: "49.99",
      currencyCode: "USD",
    },
  },
  productType: "Dog Food",
  seo: {
    __typename: "SEO",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis nisl, pulvinar eu quam in, semper tincidunt diam.",
    title: "Chicken | Good Food For Good Dogs | FOTP",
  },
  subscriptionFrequencies: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMTMyNDYwMzA=",
    value: "2,4,6",
  },
  subscriptionUnit: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMTMyNzg3OTg=",
    value: "week",
  },
  subtitle: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NTkyMTY2NjI2MDY=",
    value: "Air-Dried Fresh Food For Dogs",
  },
  title: "Chicken",
  unit: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk5MDk3ODg1NjU1ODI=",
    value: "lb",
  },
  variants: {
    __typename: "ProductVariantConnection",
    edges: [
      {
        __typename: "ProductVariantEdge",
        node: {
          __typename: "ProductVariant",
          availableForSale: true,
          barcode: null,
          bundleSize: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NTkyMTc2Nzg0MTQ=",
            value: "1",
          },
          compareAtPriceV2: null,
          defaultShippingIntervalFrequency: null,
          id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zOTU0NjQxNzE4NDg0Ng==",
          image: {
            __typename: "Image",
            height: 2400,
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg3Mjg2ODU5ODU4NzA=",
            url:
              "https://cdn.shopify.com/s/files/1/0266/2825/9918/products/food-placeholder.png?v=1637064456",
            width: 2400,
          },
          listingUsp: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMDY3OTA3MzQ=",
            value: "Best for small dogs",
          },
          priceV2: {
            __typename: "MoneyV2",
            amount: "49.99",
            currencyCode: "USD",
          },
          quantityAvailable: 0,
          selectedOptions: [
            {
              __typename: "SelectedOption",
              name: "Size",
              value: "2.5 lbs",
            },
          ],
          sku: "ckn",
          subscriptionPriceAmount: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NjkwMTI5NTExMTg=",
            value: "44.99",
          },
          title: "2.5 lbs",
          units: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTk4NTkyMjQ3NTYzMDI=",
            value: "2.5",
          },
        },
      },
    ],
  },
  vendor: "[TEST] FOTP US",
};

const productByHandle: MockedResponse = {
  request: {
    query: PRODUCT_BY_HANDLE,
    variables: {
      handle: "move",
    },
  },
  result: {
    data: {
      product: productFragment,
    },
  },
};

export default {
  productByHandle,
  productCoreFragment: productCoreMove,
  productCoreMove,
  productCoreTheOne,
  productFood,
  productFragment,
  variantFragment: variant,
};
