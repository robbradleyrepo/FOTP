import { addDays, subDays } from "date-fns";
import { advanceTo } from "jest-date-mock";

import { Connection } from "../common";
import {
  calculateChargeDelayDays,
  findBundleQuantity,
  findDefaultVariant,
  findFromPrice,
  findVariantById,
  findVariantByLegacyId,
  findVariantBySku,
  getMaxPercentageDiscount,
  getProductCoreSubscriptionMetadata,
  getProductImages,
  getProductSelectionDefaults,
  getProductSubscriptionMetadata,
  getProductVariantList,
  getVariantPrices,
  isDefaultFrequency,
  PreorderType,
  Product,
  ProductComputedMetadata,
  ProductCore,
  ProductSubscriptionMetadata,
  Variant,
} from "../product";

const locale = { timeZone: "utc" };

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    customCheckout: true,
    origin: "https://foo.bar",
    subscriptions: true,
  },
}));

const mockVariantConnection: Connection<Variant> = {
  edges: [
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: {
          id: "meta-1",
          value: "1",
        },
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8x",
        image: {
          height: 1000,
          id: "1",
          url: "https://cdn.shopify.com/mock-image/variant-1.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "50.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "1 tub",
          },
        ],
        sku: "test",
        subscriptionPriceAmount: null,
        title: "1 tub",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "60",
        },
      },
    },
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: {
          id: "meta-2",
          value: "2",
        },
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8y",
        image: {
          height: 1000,
          id: "2",
          url: "https://cdn.shopify.com/mock-image/variant-2.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "90.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "2 tubs",
          },
        ],
        sku: "test-x2",
        subscriptionPriceAmount: null,
        title: "2 tubs",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "120",
        },
      },
    },
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: {
          id: "meta-2",
          value: "2",
        },
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8z",
        image: {
          height: 1000,
          id: "3",
          url: "https://cdn.shopify.com/mock-image/variant-3.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "120.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "3 tubs",
          },
        ],
        sku: "test-x3",
        subscriptionPriceAmount: null,
        title: "3 tubs",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "180",
        },
      },
    },
  ],
};

const mockVariantConnectionWithDiscounts: Connection<Variant> = {
  edges: [
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: null,
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8x",
        image: {
          height: 1000,
          id: "1",
          url: "https://cdn.shopify.com/mock-image/variant-1.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "50.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "1 tub",
          },
        ],
        sku: "test",
        subscriptionPriceAmount: null,
        title: "1 tub",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "60",
        },
      },
    },
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: {
          amount: "100.0",
          currencyCode: "USD",
        },
        defaultShippingIntervalFrequency: null,
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8y",
        image: {
          height: 1000,
          id: "2",
          url: "https://cdn.shopify.com/mock-image/variant-2.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "90.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "2 tubs",
          },
        ],
        sku: "test-x2",
        subscriptionPriceAmount: null,
        title: "2 tubs",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "120",
        },
      },
    },
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: {
          id: "2",
          value: "1",
        },
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8z",
        image: {
          height: 1000,
          id: "3",
          url: "https://cdn.shopify.com/mock-image/variant-3.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "120.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Bundle size",
            value: "3 tubs",
          },
        ],
        sku: "test-x3",
        subscriptionPriceAmount: {
          id: "4",
          value: "40.0",
        },
        title: "3 tubs",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "180",
        },
      },
    },
  ],
};

const mockVariantConnectionShopifyDefault: Connection<Variant> = {
  edges: [
    ...mockVariantConnection.edges,
    {
      node: {
        availableForSale: true,
        barcode: "123",
        bundleSize: null,
        compareAtPriceV2: null,
        defaultShippingIntervalFrequency: null,
        id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80",
        image: {
          height: 1000,
          id: "4",
          url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
          width: 1000,
        },
        listingUsp: null,
        priceV2: {
          amount: "50.0",
          currencyCode: "USD",
        },
        quantityAvailable: 10,
        selectedOptions: [
          {
            name: "Title",
            value: "Default Title",
          },
        ],
        sku: "test",
        subscriptionPriceAmount: null,
        title: "Default Title",
        units: {
          id: "gid://shopify/Metafield/1",
          value: "60",
        },
      },
    },
  ],
};

beforeEach(() => {
  advanceTo("2020-04-03T02:01:00.000Z");
});

describe("findBundleQuantity", () => {
  it("should return the number of items in a bundle", () => {
    const quantity = 7;

    expect(
      findBundleQuantity([{ name: "Bundle size", value: `${quantity} tubs` }])
    ).toBe(quantity);
  });

  it("should return `null` if the `Bundle size` value is missing", () => {
    expect(findBundleQuantity([])).toBeNull();
  });

  it("should return `null` if the `Bundle size` value is incorrectly formatted", () => {
    expect(
      findBundleQuantity([{ name: "Bundle size", value: `Large (7 tubs)` }])
    ).toBeNull();
  });
});

describe("findDefaultVariant", () => {
  it("should return Shopify's default variant", () => {
    expect(
      findDefaultVariant(mockVariantConnectionShopifyDefault)
    ).toMatchObject({
      title: "Default Title",
    });
  });

  it("should return the first variant is no Shopify default", () => {
    expect(findDefaultVariant(mockVariantConnection)).toEqual(
      mockVariantConnection.edges[0].node
    );
  });
});

describe("findFromPrice", () => {
  it("should return the lowest price from all prices on all variants", () => {
    expect(findFromPrice(mockVariantConnection)).toMatchObject({
      amount: "50.0",
      currencyCode: "USD",
    });

    expect(findFromPrice(mockVariantConnectionWithDiscounts)).toMatchObject({
      amount: "40.0",
      currencyCode: "USD",
    });
  });
});

describe("findVariantById", () => {
  it("should return the variant with the provided ID", () => {
    const variant = findVariantById(
      mockVariantConnection,
      "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8y"
    );

    expect(variant).toMatchObject({
      id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8y",
    });
  });

  it("should return `undefined` if there is no variant with the provided ID", () => {
    expect(findVariantById(mockVariantConnection, "foo")).toBeUndefined();
  });
});

describe("findVariantByLegacyId", () => {
  it("should return the variant with the provided ID", () => {
    const variant = findVariantByLegacyId(mockVariantConnection, "2");

    expect(variant).toMatchObject({
      id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8y",
    });
  });

  it("should return `undefined` if there is no variant with the provided ID", () => {
    expect(findVariantByLegacyId(mockVariantConnection, "foo")).toBeUndefined();
  });
});

describe("findVariantBySku", () => {
  it("should return the variant with the provided ID", () => {
    const variant = findVariantBySku(mockVariantConnection, "test-x2");

    expect(variant).toMatchObject({ sku: "test-x2" });
  });

  it("should return `undefined` if there is no variant with the provided ID", () => {
    expect(findVariantBySku(mockVariantConnection, "foo")).toBeUndefined();
  });
});

describe("getMaxPercentageDiscount", () => {
  const mockProduct = ({
    variants: {
      edges: [
        {
          node: {
            compareAtPriceV2: null,
            priceV2: {
              amount: "50",
              currencyCode: "USD",
            },
          },
        },
        {
          node: {
            compareAtPriceV2: {
              amount: "100",
              currencyCode: "USD",
            },
            priceV2: {
              amount: "70",
              currencyCode: "USD",
            },
          },
        },
      ],
    },
  } as unknown) as Product;
  const mockProductWithSubscription = ({
    hasSubscription: {
      value: "True",
    },
    isSubscriptionOnly: {
      value: "False",
    },
    subscriptionFrequencies: {
      value: "1,2,3",
    },
    subscriptionUnit: {
      value: "Months",
    },
    unit: null,
    variants: {
      edges: [
        {
          node: {
            compareAtPriceV2: null,
            priceV2: {
              amount: "50",
              currencyCode: "USD",
            },
            subscriptionPriceAmount: {
              value: "30",
            },
          },
        },
        {
          node: {
            compareAtPriceV2: {
              amount: "100",
              currencyCode: "USD",
            },
            priceV2: {
              amount: "70",
              currencyCode: "USD",
            },
          },
        },
      ],
    },
  } as unknown) as Product;

  it("should return the largest percentage discount from the product variants, including subscription prices, if `config.subscriptions` is `true`", () => {
    expect(getMaxPercentageDiscount(mockProduct, {}, locale)).toBeCloseTo(
      30,
      5
    );
    expect(
      getMaxPercentageDiscount(mockProductWithSubscription, {}, locale)
    ).toBeCloseTo(40, 5);
  });

  it("should return the largest percentage discount from the product variants, excluding subscription prices, if `config.subscriptions` is `false`", () => {
    jest.isolateModules(() => {
      jest.resetModules();
      jest.doMock("../config", () => ({
        __esModule: true,
        default: {
          customCheckout: true,
          origin: "https://foo.bar",
          subscriptions: false,
        },
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const getMaxPercentageDiscount = require("../product")
        .getMaxPercentageDiscount;

      expect(getMaxPercentageDiscount(mockProduct, {}, locale)).toBeCloseTo(
        30,
        5
      );
      expect(
        getMaxPercentageDiscount(mockProductWithSubscription, {}, locale)
      ).toBeCloseTo(30, 5);
    });
  });
});

describe("getProductImage", () => {
  const productImageEdges = [
    {
      node: {
        height: 1000,
        id: "1",
        url: "https://cdn.shopify.com/mock-image/product-1.jpg",
        width: 1000,
      },
    },
    {
      node: {
        height: 1000,
        id: "2",
        url: "https://cdn.shopify.com/mock-image/product-2.jpg",
        width: 1000,
      },
    },
    {
      node: {
        height: 1000,
        id: "3",
        url: "https://cdn.shopify.com/mock-image/product-3.jpg",
        width: 1000,
      },
    },
  ];
  const productWithDefaultVariantImages = ({
    images: {
      edges: productImageEdges,
    },
    variants: {
      edges: [
        {
          node: {
            image: {
              height: 1000,
              id: "1",
              url: "https://cdn.shopify.com/mock-image/product-1.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "1",
              url: "https://cdn.shopify.com/mock-image/product-1.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "1",
              url: "https://cdn.shopify.com/mock-image/product-1.jpg",
              width: 1000,
            },
          },
        },
      ],
    },
  } as unknown) as Product;
  const productWithCustomVariantImages = ({
    images: {
      edges: [
        ...productImageEdges,
        {
          node: {
            id: "4",
            url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
          },
        },
        {
          node: {
            id: "5",
            url: "https://cdn.shopify.com/mock-image/variant-5.jpg",
          },
        },
        {
          node: {
            id: "6",
            url: "https://cdn.shopify.com/mock-image/variant-6.jpg",
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            image: {
              height: 1000,
              id: "4",
              url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "5",
              url: "https://cdn.shopify.com/mock-image/variant-5.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "6",
              url: "https://cdn.shopify.com/mock-image/variant-6.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              id: "6",
              url: "https://cdn.shopify.com/mock-image/variant-6.jpg",
            },
          },
        },
      ],
    },
  } as unknown) as Product;
  const productWithDefaultAndCustomVariantImages = ({
    images: {
      edges: [
        ...productImageEdges,
        {
          node: {
            height: 1000,
            id: "4",
            url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
            width: 1000,
          },
        },
        {
          node: {
            height: 1000,
            id: "5",
            url: "https://cdn.shopify.com/mock-image/variant-5.jpg",
            width: 1000,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            image: {
              height: 1000,
              id: "4",
              url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "5",
              url: "https://cdn.shopify.com/mock-image/variant-5.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "1",
              url: "https://cdn.shopify.com/mock-image/product-1.jpg",
              width: 1000,
            },
          },
        },
        {
          node: {
            image: {
              height: 1000,
              id: "6",
              url: "https://cdn.shopify.com/mock-image/variant-6.jpg",
              width: 1000,
            },
          },
        },
      ],
    },
  } as unknown) as Product;

  const expectedImages = productImageEdges.map(({ node }) => node);

  it("should return an array of all product images if no variants have custom images", () => {
    expect(getProductImages(productWithDefaultVariantImages)).toEqual(
      expectedImages
    );
  });

  it("should return an array of all product images excluding variant images if any variants have custom images", () => {
    expect(getProductImages(productWithCustomVariantImages)).toEqual(
      expectedImages
    );
    expect(getProductImages(productWithDefaultAndCustomVariantImages)).toEqual(
      expectedImages
    );
  });
});

describe("getProductCoreSubscriptionMetadata", () => {
  it("should return a `hasSubscription` property of `true` if the provided `hasSubscription` value is `True` (case insensitive)", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: true });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "true" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: true });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "tRuE" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: true });
  });

  it("should return a `hasSubscription` property of `false` if the provided `hasSubscription` value is not `True` (case insensitive), regardless of query params", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: null,
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: false });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "False" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: false });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "foo" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({ hasSubscription: false });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: null,
        } as unknown) as ProductCore,
        { has_subscription: "True" }
      )
    ).toMatchObject({ hasSubscription: false });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: null,
        } as unknown) as ProductCore,
        { has_subscription: "true" }
      )
    ).toMatchObject({ hasSubscription: false });
  });

  it("should return a `hasSubscription` property of `false` if the provided `hasSubscription` value is `True` but the `has_subscription` query param is `False`", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        { has_subscription: "False" }
      )
    ).toMatchObject({
      hasSubscription: false,
    });
  });

  it("should return a `hasSubscription` property of `false` if the provided `hasSubscription` value is `True` but the `preorderType` is `PURPLE_DOT`", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          preorderType: {
            id: "preorder-id",
            value: "PURPLE_DOT",
          },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({
      hasSubscription: false,
    });
  });

  it("should return a `hasSubscription` property of `false` if the provided `hasSubscription` value is `True` but `config.subscriptions` is `false`", () => {
    jest.isolateModules(() => {
      jest.resetModules();
      jest.doMock("../config", () => ({
        __esModule: true,
        default: {
          customCheckout: true,
          origin: "https://foo.bar",
          subscriptions: false,
        },
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const getProductCoreSubscriptionMetadata = require("../product")
        .getProductCoreSubscriptionMetadata;

      expect(
        getProductCoreSubscriptionMetadata(
          ({
            hasSubscription: { value: "True" },
            subscriptionFrequencies: {
              value: "1,2,3",
            },
            subscriptionUnit: { value: "Days" },
          } as unknown) as ProductCore,
          {}
        )
      ).toMatchObject({
        hasSubscription: false,
      });
    });
  });

  it("should return a `isSubscriptionOnly` property of `true` if the provided `is_subscription_only` query param is `True` (case insensitive), regardless of `isSubscriptionOnly` value", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          isSubscriptionOnly: { value: "False" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        { is_subscription_only: "True" }
      )
    ).toMatchObject({
      isSubscriptionOnly: true,
    });
  });

  it("should return a `isSubscriptionOnly` property of `true` if the provided `isSubscriptionOnly` value is `True` (case insensitive)", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          isSubscriptionOnly: { value: "True" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({
      isSubscriptionOnly: true,
    });
  });

  it("should return a `isSubscriptionOnly` property of `false` if neither the provided `isSubscriptionOnly` value nor `is_subscription_only` query param are `True` (case insensitive)", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          isSubscriptionOnly: { value: "False" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({
      isSubscriptionOnly: false,
    });
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          isSubscriptionOnly: { value: "False" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        { is_subscription_only: "foo" }
      )
    ).toMatchObject({
      isSubscriptionOnly: false,
    });
  });

  it("should return `frequency` and `unit` data if `hasSubscription` value is `True` and `config.subscriptions` is `true`", () => {
    expect(
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: {
            value: "1,2,3",
          },
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toMatchObject({
      frequencies: ["1", "2", "3"],
      hasSubscription: true,
      unit: "DAY",
    });
  });

  it("should throw an error if the provided metafields are incomplete or inconsistent", () => {
    expect(() =>
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: null,
          subscriptionUnit: { value: "Days" },
        } as unknown) as ProductCore,
        {}
      )
    ).toThrowError("Invalid subscription metafields");

    expect(() =>
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: { value: "1,2,3" },
          subscriptionUnit: null,
        } as unknown) as ProductCore,
        {}
      )
    ).toThrowError("Invalid subscription metafields");

    expect(() =>
      getProductCoreSubscriptionMetadata(
        ({
          hasSubscription: { value: "True" },
          subscriptionFrequencies: { value: "1,2,3" },
          subscriptionUnit: { value: "Foo" },
        } as unknown) as ProductCore,
        {}
      )
    ).toThrowError('Invalid order interval unit "Foo"');
  });
});

describe("getSubscriptionMetadata", () => {
  it("should return `defaultFrequencies` map when `hasSubscription` value is `True`", () => {
    const product = ({
      hasSubscription: { value: "True" },
      subscriptionFrequencies: {
        value: "1,2,3",
      },
      subscriptionUnit: { value: "Days" },
      unit: null,
      variants: {
        edges: [
          {
            node: {
              defaultShippingIntervalFrequency: {
                id: "meta-1",
                value: "1",
              },
              sku: "sku",
            },
          },
        ],
      },
    } as unknown) as Product;
    const query = {};

    expect(
      getProductSubscriptionMetadata(product, query, locale)
    ).toMatchObject({
      ...getProductCoreSubscriptionMetadata(product, query),
      defaultFrequencies: new Map([["sku", "1"]]),
    });
  });

  it("should return valid `preorder:type` metafield values", () => {
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderType: { value: "none" },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({ preorder: { type: PreorderType.NONE } });
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderType: { value: "SHOPIFY" },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({ preorder: { type: PreorderType.SHOPIFY } });
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderType: { value: "pUrPlE_DoT" },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({ preorder: { type: PreorderType.PURPLE_DOT } });
  });

  it("should default to `PreorderType.NONE` for invalid or missing `preorder:type` metafield values", () => {
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderType: { value: "FOO" },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({ preorder: { type: PreorderType.NONE } });
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderType: null,
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({ preorder: { type: PreorderType.NONE } });
  });

  it("should return a `preorder.shippingEstimate` value of `null` if no `preorderShippingEstimate` metafield is provided", () => {
    expect(
      getProductSubscriptionMetadata(({} as unknown) as Product, {}, locale)
    ).toMatchObject({ preorder: { shippingEstimate: null } });
  });

  it("should return the `preorder.shippingEstimate` value if a `preorderShippingEstimate` metafield is provided", () => {
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderShippingEstimate: {
            value: "2030-10-11",
          },
          variants: { edges: [] },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({
      preorder: { shippingEstimate: new Date(Date.UTC(2030, 9, 11)) },
    });
  });

  it("should return the `preorder.shippingEstimate` as null if a `preorderShippingEstimate` metafield value is in the past", () => {
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderShippingEstimate: {
            value: "2019-01-01",
          },
          variants: { edges: [] },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({
      preorder: { shippingEstimate: null },
    });
  });

  it("should return the `preorder.shippingEstimate` as null if a `preorderShippingEstimate` metafield is provided with an invalid date string", () => {
    expect(
      getProductSubscriptionMetadata(
        ({
          preorderShippingEstimate: {
            value: "2020123456",
          },
          variants: { edges: [] },
        } as unknown) as Product,
        {},
        locale
      )
    ).toMatchObject({
      preorder: { shippingEstimate: null },
    });
  });
});

describe("getProductVariantList", () => {
  const mockProduct = {
    variants: mockVariantConnection,
  } as Product;

  it("should return the list of available SKUs specified by the `defaultVariantOrder`, as long as all provided SKUs are valid", () => {
    // Separated by a space
    expect(
      getProductVariantList({
        ...mockProduct,
        defaultVariantOrder: {
          id: "default-variant-order",
          value: "test-x3, test-x2, test",
        },
      })
    ).toEqual(["test-x3", "test-x2", "test"]);

    // No space
    expect(
      getProductVariantList({
        ...mockProduct,
        defaultVariantOrder: {
          id: "default-variant-order",
          value: "test-x3,test-x2,test",
        },
      })
    ).toEqual(["test-x3", "test-x2", "test"]);

    // Irregular spacing
    expect(
      getProductVariantList({
        ...mockProduct,
        defaultVariantOrder: {
          id: "default-variant-order",
          value: "   test-x3, test-x2,test ",
        },
      })
    ).toEqual(["test-x3", "test-x2", "test"]);
  });

  it("should return a list of all variants if there is no `defaultVariantOrder` metafield", () => {
    expect(
      getProductVariantList({
        ...mockProduct,
        defaultVariantOrder: null,
      })
    ).toEqual(["test", "test-x2", "test-x3"]);
  });

  it("should throw an error if the `defaultVariantOrder` metafield contains an invalid SKU", () => {
    expect(() =>
      getProductVariantList({
        ...mockProduct,
        defaultVariantOrder: {
          id: "default-variant-order",
          value: "test-x3, test-x2, test, foo",
        },
      })
    ).toThrowErrorMatchingSnapshot();
  });
});

describe("getProductSelectionDefaults", () => {
  const mockProductWithSubscription = {
    defaultSelectionSku: {
      id: "default-selection-sku",
      value: "test-x2",
    },
    defaultSelectionSubscription: null,
    defaultVariantOrder: null,
    handle: "test-product",
    variants: mockVariantConnection,
  } as Product;

  const mockProductWithoutSubscription = {
    ...mockProductWithSubscription,
    defaultSelectionSubscription: {
      id: "default-selection-subscription",
      value: "false",
    },
  };

  const subscriptionMetadataWithSub: ProductSubscriptionMetadata = {
    defaultFrequencies: new Map([
      ["test", "1"],
      ["test-x2", "2"],
      ["test-x3", "3"],
    ]),
    frequencies: ["1", "2", "3", "4", "5", "6"],
    hasSubscription: true,
    isSubscriptionOnly: false,
    preorder: { shippingEstimate: null, type: PreorderType.NONE },
    unit: "MONTH",
  };
  const subscriptionMetadataWithoutSub: ProductSubscriptionMetadata = {
    hasSubscription: false,
    preorder: { shippingEstimate: null, type: PreorderType.NONE },
  };

  it("should return the list of available SKUs", () => {
    const mockProduct = {
      ...mockProductWithSubscription,
      defaultVariantOrder: {
        id: "default-variant-order",
        value: "test-x3, test-x2, test",
      },
    };

    expect(
      getProductSelectionDefaults(
        mockProduct,
        { sku: "test", variant: "3" },
        subscriptionMetadataWithoutSub
      ).listedSkus
    ).toEqual(getProductVariantList(mockProduct));
  });

  it("should return the initially selected SKU", () => {
    // Use the `variant` query param in preference to all others
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { sku: "test", variant: "3" },
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test-x3" });

    // Fallback to the SKU specified by `sku` query param
    expect(
      getProductSelectionDefaults(
        {
          ...mockProductWithSubscription,
          defaultVariantOrder: {
            id: "default-variant-order",
            value: "test, test-x2",
          },
        },
        { sku: "test", variant: "3" },
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test" });

    expect(
      getProductSelectionDefaults(
        {
          ...mockProductWithSubscription,
          defaultVariantOrder: {
            id: "default-variant-order",
            value: "test, test-x2, test-x3",
          },
        },
        { sku: "test" },
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test" });

    // Fallback to the SKU specified by `defaultSelectionSku` metafield
    expect(
      getProductSelectionDefaults(
        {
          ...mockProductWithSubscription,
          defaultVariantOrder: {
            id: "default-variant-order",
            value: "test-x2, test-x3",
          },
        },
        { sku: "test" },
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test-x2" });

    expect(
      getProductSelectionDefaults(
        {
          ...mockProductWithSubscription,
          defaultVariantOrder: {
            id: "default-variant-order",
            value: "test, test-x2, test-x3",
          },
        },
        {},
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test-x2" });

    // Final fallback to the first listed SKU
    expect(
      getProductSelectionDefaults(
        {
          ...mockProductWithSubscription,
          defaultSelectionSku: null,
          defaultVariantOrder: {
            id: "default-variant-order",
            value: "test-x3",
          },
        },
        {},
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ sku: "test-x3" });
  });

  it("should return the frequency specified in the query if it is a valid frequency", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        {
          frequency: "3",
        },
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ frequency: "3" });
  });

  it("should return the frequency specified in the defaultFrequencies if there is not a valid frequency in the query", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        {},
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ frequency: "2" });
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { frequency: "7" },
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ frequency: "2" });
  });

  it("should return the first available frequency if there isn't a valid frequency in the defaultFrequencies or query", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { frequency: "7" },
        {
          ...subscriptionMetadataWithSub,
          defaultFrequencies: new Map<string, string>(),
          unit: "DAY",
        }
      )
    ).toMatchObject({ frequency: "1" });
  });

  it("should return a subscription value of `true` if the query value is not `'false'`, the selection subscription metafield value is not `false` and the product is subscribable", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        {},
        {
          ...subscriptionMetadataWithSub,
          unit: "DAY",
        }
      )
    ).toMatchObject({ subscription: true });
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { subscription: "foo" },
        {
          ...subscriptionMetadataWithSub,
          unit: "DAY",
        }
      )
    ).toMatchObject({ subscription: true });
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        {},
        {
          ...subscriptionMetadataWithSub,
          unit: "DAY",
        }
      )
    ).toMatchObject({ subscription: true });
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { subscription: "false" },
        {
          ...subscriptionMetadataWithSub,
          unit: "DAY",
        }
      )
    ).toMatchObject({ subscription: false });
  });

  it("should return a subscription value of `false` if the query value is not `'true'`, the selection subscription metafield value is `false` and the product is subscribable", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithoutSubscription,
        {},
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ subscription: false });
    expect(
      getProductSelectionDefaults(
        mockProductWithoutSubscription,
        { subscription: "foo" },
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ subscription: false });
    expect(
      getProductSelectionDefaults(
        mockProductWithoutSubscription,
        { subscription: "true" },
        subscriptionMetadataWithSub
      )
    ).toMatchObject({ subscription: true });
  });

  it("should return a subscription value of `false` if product is not subscribable", () => {
    expect(
      getProductSelectionDefaults(
        mockProductWithSubscription,
        { subscription: "true" },
        subscriptionMetadataWithoutSub
      )
    ).toMatchObject({ subscription: false });
  });
});

describe("getVariantPrices", () => {
  const mockVariant: Variant = {
    availableForSale: true,
    barcode: "123",
    bundleSize: null,
    compareAtPriceV2: null,
    defaultShippingIntervalFrequency: {
      id: "2",
      value: "1",
    },
    id: "1",
    image: {
      height: 1000,
      id: "1",
      url: "https://cdn.shopify.com/mock-image/variant-1.jpg",
      width: 1000,
    },
    listingUsp: null,
    priceV2: {
      amount: "39.99",
      currencyCode: "USD",
    },
    quantityAvailable: 10,
    selectedOptions: [
      {
        name: "Bundle size",
        value: "1 tub",
      },
    ],
    sku: "test",
    subscriptionPriceAmount: {
      id: "1",
      value: "33.99",
    },
    title: "1 tub",
    units: {
      id: "gid://shopify/Metafield/1",
      value: "60",
    },
  };

  it("should return the one-off and subscription prices as money objects, regardless of whether or not the subscription is selected", () => {
    const oneOffSelected = getVariantPrices(mockVariant, false);
    const subscriptionSelected = getVariantPrices(mockVariant, true);

    expect(oneOffSelected.oneOffPrice).toBe(mockVariant.priceV2);
    expect(subscriptionSelected.oneOffPrice).toBe(mockVariant.priceV2);

    expect(oneOffSelected.subscriptionPrice).toEqual({
      amount: mockVariant.subscriptionPriceAmount?.value,
      currencyCode: "USD",
    });
    expect(subscriptionSelected.subscriptionPrice).toEqual({
      amount: mockVariant.subscriptionPriceAmount?.value,
      currencyCode: "USD",
    });
  });

  it("should return the one-off price as the current price if the subscription is not selected", () => {
    const { currentPrice, oneOffPrice } = getVariantPrices(mockVariant, false);

    expect(currentPrice).toBe(oneOffPrice);
  });

  it("should return the subscription price as the current price if the subscription is selected", () => {
    const { currentPrice, subscriptionPrice } = getVariantPrices(
      mockVariant,
      true
    );

    expect(currentPrice).toBe(subscriptionPrice);
  });

  it("should not return a current price if the subscription selection argument is not provided", () => {
    expect(getVariantPrices(mockVariant)).not.toHaveProperty("currentPrice");
  });

  it("should return the 'compare at' price as the regular price, regardless of whether or not the subscription is selected", () => {
    const compareAtPriceV2 = {
      amount: "44.99",
      currencyCode: "USD",
    };
    const mockVariantWithCompareAtPrice = {
      ...mockVariant,
      compareAtPriceV2,
    };

    const oneOffSelected = getVariantPrices(
      mockVariantWithCompareAtPrice,
      false
    );
    const subscriptionSelected = getVariantPrices(
      mockVariantWithCompareAtPrice,
      true
    );

    expect(oneOffSelected.regularPrice).toBe(compareAtPriceV2);
    expect(subscriptionSelected.regularPrice).toBe(compareAtPriceV2);
  });

  it("should return the one-off price as the regular price if there is no 'compare at' price, regardless of whether or not the subscription is selected", () => {
    const oneOffSelected = getVariantPrices(mockVariant, false);
    const subscriptionSelected = getVariantPrices(mockVariant, true);

    expect(oneOffSelected.regularPrice).toBe(mockVariant.priceV2);
    expect(subscriptionSelected.regularPrice).toBe(mockVariant.priceV2);
  });

  it("should return the discount base on the regular price for the current, one-off and subscription prices", () => {
    const compareAtPriceV2 = {
      amount: "44.99",
      currencyCode: "USD",
    };
    const mockVariantWithCompareAtPrice = {
      ...mockVariant,
      compareAtPriceV2,
    };

    const oneOffSelected = getVariantPrices(
      mockVariantWithCompareAtPrice,
      false
    );
    const subscriptionSelected = getVariantPrices(
      mockVariantWithCompareAtPrice,
      true
    );

    // One-off discount
    expect(oneOffSelected.oneOffDiscount).toMatchSnapshot();
    expect(subscriptionSelected.oneOffDiscount).toEqual(
      oneOffSelected.oneOffDiscount
    );

    // Subscription discount
    expect(oneOffSelected.subscriptionDiscount).toMatchSnapshot();
    expect(subscriptionSelected.subscriptionDiscount).toEqual(
      oneOffSelected.subscriptionDiscount
    );

    // Current discount
    expect(oneOffSelected.currentDiscount).toEqual(
      oneOffSelected.oneOffDiscount
    );
    expect(subscriptionSelected.currentDiscount).toEqual(
      subscriptionSelected.subscriptionDiscount
    );
  });

  it("should not return a current discount if the subscription selection argument is not provided", () => {
    expect(getVariantPrices(mockVariant)).not.toHaveProperty("currentDiscount");
  });
});

describe("isDefaultFrequency", () => {
  const meta = ({
    selection: {
      config: {
        sku: "test-x2",
        subscription: true,
      },
    },
    subscription: {
      defaultFrequencies: new Map([
        ["test", "1"],
        ["test-x2", "2"],
        ["test-x3", "3"],
      ]),
      frequencies: ["1", "2", "3", "4", "5", "6"],
      hasSubscription: true,
      unit: "MONTH",
    },
  } as unknown) as ProductComputedMetadata;

  it("should return `true` if the provided value is the default frequency specified in the product selection config", () => {
    expect(isDefaultFrequency(meta, "test-x3", "3")).toBe(true);
  });

  it("should return `false` if the provided value is not the default frequency specified in the product selection config", () => {
    expect(isDefaultFrequency(meta, "test-x3", "2")).toBe(false);
  });
});

describe("calculateChargeDelayDays", () => {
  it("Should return null when the `shippingEstimate` is in the past", () => {
    expect(
      calculateChargeDelayDays(1, "DAY", subDays(new Date(), 1))
    ).toBeNull();
  });

  it("Should return value when the `shippingEstimate` is in the future", () => {
    expect(calculateChargeDelayDays(30, "DAY", addDays(new Date(), 1))).toEqual(
      // 1 day delay + first frequency
      31
    );
    expect(calculateChargeDelayDays(1, "WEEK", addDays(new Date(), 1))).toEqual(
      // 1 day delay + first frequency
      8
    );
    expect(
      calculateChargeDelayDays(1, "MONTH", addDays(new Date(), 1))
    ).toEqual(
      // 1 day delay + first frequency
      31
    );
  });
});
