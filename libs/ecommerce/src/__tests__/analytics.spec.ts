import {
  mapCartLineItemToDataLayer,
  mapProductToDataLayer,
  mapProductVariantToDataLayer,
} from "../analytics";
import { productCoreMove, variant } from "../testing/queries/product";

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    customCheckout: false,
    origin: "https://example.com",
    subscriptions: false,
  },
}));

describe("mappers", () => {
  test("mapProductToDataLayer", () => {
    expect(mapProductToDataLayer(productCoreMove)).toMatchSnapshot();
  });

  test("mapProductToDataLayer preorder", () => {
    expect(
      mapProductToDataLayer({
        ...productCoreMove,
        preorderType: {
          id: "metafield-1",
          value: "shopify",
        },
      })
    ).toMatchSnapshot();
    expect(
      mapProductToDataLayer({
        ...productCoreMove,
        preorderType: {
          id: "metafield-1",
          value: "purple_dot",
        },
      })
    ).toMatchSnapshot();
  });

  test("mapProductVariantToDataLayer OTP", () => {
    expect(
      mapProductVariantToDataLayer(productCoreMove, variant)
    ).toMatchSnapshot();
  });

  it("mapProductVariantToDataLayer Sub", () => {
    expect(
      mapProductVariantToDataLayer(productCoreMove, variant, {
        chargeDelayDays: null,
        orderIntervalFrequency: 1,
        orderIntervalUnit: "MONTH",
      })
    ).toMatchSnapshot();
  });

  it("mapCartLineItemToDataLayer", () => {
    expect(
      mapCartLineItemToDataLayer(
        {
          container: null,
          containerPrices: null,
          frequency: null,
          handle: productCoreMove.handle,
          id: "cart-line-item-1",
          imageUrl: "https://foo.bar/baz.jpg",
          lineCompareAtPrice: null,
          linePrice: {
            amount: "5.00",
            currencyCode: "USD",
          },
          productId: "product-1",
          properties: {},
          quantity: 1,
          subscriptionUnitPrice: {
            amount: "4.50",
            currencyCode: "USD",
          },
          subtitle: "Default Title",
          title: "Test product",
          unitPrice: {
            amount: "5.00",
            currencyCode: "USD",
          },
          variant: {
            ...variant,
            product: productCoreMove,
          },
          variantId: "variant-2",
        },
        0
      )
    ).toMatchSnapshot();
  });
});
