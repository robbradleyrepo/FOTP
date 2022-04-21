import { captureException } from "@sentry/nextjs";
import { CheckoutWithVariants, LineItemType } from "@sss/ecommerce/checkout";
import { CHECKOUT_ID, mockedResponses } from "@sss/ecommerce/testing";
import { waitFor } from "@testing-library/react";
import store from "store/dist/store.modern";
import { mocked } from "ts-jest/utils";

import { anonymous } from "../../../sandbox";
import * as toast from "../../../ui/base/toast";
import * as Restore from "../restore";

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));
jest.mock("uuid", () => ({ v4: jest.fn(() => "mock-id") }));

const mockedCaptureException = mocked(captureException);

const mockToastController = {
  push: jest.fn(),
};

jest.spyOn(toast, "useToastController").mockReturnValue(
  mockToastController as any // eslint-disable-line @typescript-eslint/no-explicit-any
);

describe("checkoutLineItemsToCartLineItems", () => {
  const NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    (process.env.NODE_ENV as unknown) = NODE_ENV;
  });

  const product = mockedResponses.product.productFragment;
  const variant = mockedResponses.product.variantFragment;

  const checkoutLineItem = {
    __typename: "RLineItem",
    frequency: {
      __typename: "RFrequency",
      chargeDelayDays: null,
      orderIntervalFrequency: 30,
      orderIntervalUnit: "DAY",
    },
    id: "E9vEeaxExeZQv38FGeT+UAVTr/o=",
    image:
      "https://cdn.shopify.com/s/files/1/0266/2825/9918/products/the-one-x1.png?v=1589206978",
    linePrice: variant.priceV2,
    price: variant.priceV2,
    product: product,
    productId: product.id,
    productType: "",
    properties: [],
    quantity: 1,
    sku: variant.sku,
    title: product.title,
    variant: variant,
    variantId: variant.id,
    variantTitle: variant.title,
    vendor: "Front Of The Pack",
  };

  const checkout = ({
    id: "checkout-id",
    lineItems: [checkoutLineItem],
  } as unknown) as CheckoutWithVariants;

  it("should map ReCharge checkout line items to cart line items", () => {
    expect(
      Restore.checkoutLineItemsToCartLineItems(checkout)
    ).toMatchSnapshot();
  });

  it("should use the `cartLineItemId`, if available", () => {
    const cartLineItemId = "cart-line-item-id";

    const result = Restore.checkoutLineItemsToCartLineItems(({
      ...checkout,
      lineItems: [
        checkoutLineItem,
        {
          ...checkoutLineItem,
          properties: [{ name: "cartLineItemId", value: cartLineItemId }],
        },
      ],
    } as unknown) as CheckoutWithVariants);

    expect(result[0].id).toBe(checkoutLineItem.id);
    expect(result[1].id).toBe(cartLineItemId);
  });

  it("should avoid assigning duplicate line IDs", () => {
    const cartLineItemId = "cart-line-item-id";

    const corruptCheckout = ({
      ...checkout,
      lineItems: [
        {
          ...checkoutLineItem,
          properties: [{ name: "cartLineItemId", value: cartLineItemId }],
        },
        {
          ...checkoutLineItem,
          properties: [{ name: "cartLineItemId", value: cartLineItemId }],
        },
      ],
    } as unknown) as CheckoutWithVariants;

    expect(mockedCaptureException).not.toHaveBeenCalled();

    // Non-production
    expect(() =>
      Restore.checkoutLineItemsToCartLineItems(corruptCheckout)
    ).toThrowErrorMatchingSnapshot();

    // Production
    (process.env.NODE_ENV as unknown) = "production";

    const result = Restore.checkoutLineItemsToCartLineItems(corruptCheckout);

    expect(result[0].id).toBe(cartLineItemId);
    expect(result[1].id).toBe(checkoutLineItem.id);

    expect(mockedCaptureException.mock.calls).toMatchSnapshot();
  });

  it("should handle containers", () => {
    const cartLineItemId = "cart-line-item-id";
    const containerVariantId = "container-variant-id";

    expect(
      Restore.checkoutLineItemsToCartLineItems(({
        ...checkout,
        lineItems: [
          { ...checkoutLineItem, frequency: null },
          {
            ...checkoutLineItem,
            frequency: null,
            product: {
              ...product,
              containers: {
                otp: {
                  base: null,
                  upgrade: {
                    price: { amount: "15.0", currencyCode: "USD" },
                    variantId: containerVariantId,
                  },
                },
                sub: {
                  base: {
                    price: { amount: "0.0", currencyCode: "USD" },
                    variantId: containerVariantId,
                  },
                  upgrade: null,
                },
              },
            },
            properties: [{ name: "cartLineItemId", value: cartLineItemId }],
          },
          {
            properties: [
              { name: "cartLineItemId", value: cartLineItemId },
              { name: "lineItemType", value: LineItemType.CONTAINER },
            ],
            variantId: containerVariantId,
          },
        ],
      } as unknown) as CheckoutWithVariants)
    ).toMatchSnapshot();
  });

  it("should remove reserved properties and return all others", () => {
    const cartLineItemId = "cart-line-item-id";
    const containerVariantId = "container-variant-id";

    expect(
      Restore.checkoutLineItemsToCartLineItems(({
        ...checkout,
        lineItems: [
          {
            ...checkoutLineItem,
            frequency: null,
            product: {
              ...product,
              containers: {
                otp: {
                  base: null,
                  upgrade: {
                    price: { amount: "15.0", currencyCode: "USD" },
                    variantId: containerVariantId,
                  },
                },
                sub: {
                  base: {
                    price: { amount: "0.0", currencyCode: "USD" },
                    variantId: containerVariantId,
                  },
                  upgrade: null,
                },
              },
            },
            properties: [
              { name: "foo", value: "Lorem ipsum dolor sit amet" },
              { name: "cartLineItemId", value: cartLineItemId },
              { name: "bar", value: "Sed condimentum velit sit amet" },
            ],
            variantId: containerVariantId,
          },
        ],
      } as unknown) as CheckoutWithVariants)
    ).toMatchSnapshot();
  });
});

describe("<CartRestore />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.clearAll();
  });

  it("should redirect to the cart page if the checkout is successfully restored", async () => {
    const { router } = await anonymous.page({
      NextPage: Restore,
      mocks: [mockedResponses.checkout.restoreSuccess],
      params: {
        token: CHECKOUT_ID,
      },
      pathname: "/cart/restore",
    });

    await waitFor(() => {
      const cart = store.get("cart");

      expect(cart).toMatchSnapshot();

      expect(router.replace).toHaveBeenCalledWith("/cart");
    });
  });

  it("should redirect to the cart page and display a warning if the checkout has been completed", async () => {
    const { router } = await anonymous.page({
      NextPage: Restore,
      mocks: [
        mockedResponses.checkout.restoreFail,
        mockedResponses.checkout.restoreCompletedCoreSuccess,
      ],
      params: {
        token: CHECKOUT_ID,
      },
      pathname: "/cart/restore",
    });

    await waitFor(() => {
      const cart = store.get("cart");

      expect(cart).toMatchSnapshot();

      expect(router.replace).toHaveBeenCalledWith("/cart");
      expect(mockToastController.push).toHaveBeenCalledWith({
        children: "Your cart has already been completed",
        type: toast.ToastType.WARNING,
      });
    });
  });

  it("should redirect to the cart page and display an error if the checkout does not exist", async () => {
    const { router } = await anonymous.page({
      NextPage: Restore,
      mocks: [
        mockedResponses.checkout.restoreFail,
        mockedResponses.checkout.restoreCompletedCoreFail,
      ],
      params: {
        token: CHECKOUT_ID,
      },
      pathname: "/cart/restore",
    });

    await waitFor(() => {
      const cart = store.get("cart");

      expect(cart).toMatchSnapshot();

      expect(router.replace).toHaveBeenCalledWith("/cart");
      expect(mockToastController.push).toHaveBeenCalledWith({
        children:
          "There was a problem restoring your cart: the link you used is invalid or incomplete",
        type: toast.ToastType.ERROR,
      });
    });
  });

  it("should redirect to the cart page is no token is provided", async () => {
    const { router } = await anonymous.page({
      NextPage: Restore,
      pathname: "/cart/restore",
    });

    await waitFor(() => {
      const cart = store.get("cart");

      expect(cart).toMatchSnapshot();

      expect(router.replace).toHaveBeenCalledWith("/cart");
      expect(mockToastController.push).not.toHaveBeenCalled();
    });
  });
});
