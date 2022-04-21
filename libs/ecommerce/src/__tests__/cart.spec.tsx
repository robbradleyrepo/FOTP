import {
  MockedProvider as MockApolloProvider,
  MockedResponse,
} from "@apollo/react-testing";
import * as ecommerce from "@sss/ecommerce/testing";
import { act, renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import store from "store/dist/store.modern";

import {
  CART_STATE_VERSION,
  CartActionType,
  CartLineItem,
  CartLineItemActionType,
  CartProvider,
  CartState,
  CartStatus,
  CoreCartLineItem,
  getCoreCartLineItem,
  getHasSubscription,
  reducer,
  StoredCartState,
  useCart,
  useEnhancedData,
  VARIANT_INFO,
} from "../cart";
import { CHECKOUT_COMPLETED_CORE } from "../checkout";

jest.mock("uuid", () => {
  const counter = jest.fn();

  return {
    v4: jest.fn(() => {
      const id = `fake-id-${counter.mock.calls.length}`;

      counter();

      return id;
    }),
  };
});

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    customCheckout: false,
    origin: "https://example.com",
    subscriptions: false,
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Cart", () => {
  const EMPTY_CART: CartState = {
    checkoutId: null,
    customAttributes: {},
    discountCode: null,
    id: null,
    lineItems: [],
    rCheckoutId: null,
  };

  const mockedProductCore =
    ecommerce.mockedResponses.product.productCoreFragment;
  const mockedVariant = ecommerce.mockedResponses.product.variantFragment;

  const coreLineItem: CoreCartLineItem = {
    containerPrices: null,
    handle: "move",
    imageUrl: "https://cdn.shopify.com/mock-image/variant-4.jpg",
    productId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1MzU1Mzc1MzMwMDY=",
    subscriptionUnitPrice: {
      amount: "29.99",
      currencyCode: "USD",
    },
    subtitle: "Default Title",
    title: "Move",
    unitPrice: {
      amount: "34.99",
      currencyCode: "USD",
    },
    variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
  };

  const lineItem: CartLineItem = {
    ...coreLineItem,
    frequency: null,
    properties: {},
    quantity: 1,
  };

  describe("Reducer", () => {
    it("can set an id on the cart (e.g. for tracking)", () => {
      const s1 = reducer(EMPTY_CART, {
        payload: { id: "foo" },
        type: CartActionType.INIT,
      });

      expect(s1.id).toEqual("foo");
    });

    it("can reset a cart by re-initializing it", () => {
      const s1 = reducer(
        {
          checkoutId: null,
          customAttributes: {},
          discountCode: null,
          id: "abc",
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "hij",
              quantity: 3,
            },
          ],
          rCheckoutId: null,
          version: CART_STATE_VERSION,
        },
        {
          payload: { id: "def" },
          type: CartActionType.INIT,
        }
      );

      expect(s1.id).not.toEqual("abc");
      expect(s1.lineItems).toEqual([]);
    });

    it("can associate a checkout to the cart", () => {
      const s1 = reducer(
        { ...EMPTY_CART, checkoutId: null, id: "foo" },
        {
          payload: { checkoutId: "bar" },
          type: CartActionType.CHECKOUT_ACTIVE,
        }
      );
      expect(s1.checkoutId).toEqual("bar");

      const s2 = reducer(
        { ...EMPTY_CART, id: "foo", rCheckoutId: null },
        {
          payload: { rCheckoutId: "baz" },
          type: CartActionType.CHECKOUT_ACTIVE,
        }
      );
      expect(s2.rCheckoutId).toEqual("baz");
    });

    it("can set custom attributes in the cart", () => {
      const s1 = reducer(
        { ...EMPTY_CART, id: "foo" },
        {
          payload: { customAttributes: { a: "b" } },
          type: CartActionType.SET_CUSTOM_ATTRIBUTES,
        }
      );
      expect(s1.customAttributes).toEqual({ a: "b" });

      const s2 = reducer(
        { ...EMPTY_CART, id: "foo" },
        {
          payload: { customAttributes: { c: "d" } },
          type: CartActionType.SET_CUSTOM_ATTRIBUTES,
        }
      );
      expect(s2.customAttributes).toEqual({ c: "d" });
    });

    it("can set a discount code in the cart", () => {
      const s1 = reducer(
        { ...EMPTY_CART, id: "foo" },
        {
          payload: { discountCode: "SAVE" },
          type: CartActionType.SET_DISCOUNT_CODE,
        }
      );
      expect(s1.discountCode).toBe("SAVE");

      const s2 = reducer(s1, {
        payload: { discountCode: "FOO" },
        type: CartActionType.SET_DISCOUNT_CODE,
      });
      expect(s2.discountCode).toBe("FOO");

      const s3 = reducer(s2, {
        payload: { discountCode: null },
        type: CartActionType.SET_DISCOUNT_CODE,
      });
      expect(s3.discountCode).toBeNull();
    });

    it("can restore previous content", () => {
      const s1 = reducer(EMPTY_CART, {
        payload: {
          checkoutId: null,
          customAttributes: {},
          discountCode: "SAVE",
          id: "foo",
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "baz",
              quantity: 3,
            },
          ],
          rCheckoutId: "bar",
        },
        type: CartActionType.LOAD,
      });

      expect(s1).toEqual({
        checkoutId: null,
        customAttributes: {},
        discountCode: "SAVE",
        id: "foo",
        lineItems: [
          {
            ...lineItem,
            frequency: null,
            id: "baz",
            quantity: 3,
          },
        ],
        rCheckoutId: "bar",
      });
    });

    it("should combine items with equal variantId, frequency and properties into the same line item", () => {
      const properties = {
        bar: "Sed condimentum velit sit amet",
        foo: "Lorem ipsum dolor sit amet",
      };

      const s1 = reducer(EMPTY_CART, {
        payload: {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 1,
            orderIntervalUnit: "MONTH",
          },
          id: "foo",
          properties: { ...properties },
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      const s2 = reducer(s1, {
        payload: {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 1,
            orderIntervalUnit: "MONTH",
          },
          id: "bar",
          properties: { ...properties },
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      expect(s2.lineItems).toEqual([
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 1,
            orderIntervalUnit: "MONTH",
          },
          id: "foo",
          properties,
          quantity: 2,
        },
      ]);
    });

    it("should keep items with same variantId but different frequencies or properties in different line items", () => {
      const s1 = reducer(EMPTY_CART, {
        payload: {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      const s2 = reducer(s1, {
        payload: {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "bar",
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      expect(s2.lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "bar",
          quantity: 1,
        },
      ]);

      const s3 = reducer(s2, {
        payload: {
          ...lineItem,
          frequency: null,
          id: "baz",
          properties: {
            foo: "bar",
          },
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });

      expect(s3.lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "bar",
          quantity: 1,
        },
        {
          ...lineItem,
          frequency: null,
          id: "baz",
          properties: {
            foo: "bar",
          },
          quantity: 1,
        },
      ]);
    });

    it("should add item when when action is INCREMENT and it is not in the cart", () => {
      const { lineItems } = reducer(EMPTY_CART, {
        payload: {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
      ]);
    });

    it("should update quantity when action is INCREMENT and it is already in the cart", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
          },
          type: CartLineItemActionType.INCREMENT,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          properties: {},
          quantity: 2,
        },
      ]);
    });

    it("should prefer `true` values for `containerUpgrade` when action is INCREMENT and it is already in the cart", () => {
      const s1 = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              containerUpgrade: false,
              frequency: null,
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            containerUpgrade: true,
            frequency: null,
            quantity: 1,
          },
          type: CartLineItemActionType.INCREMENT,
        }
      );
      expect(s1.lineItems).toEqual([
        {
          ...lineItem,
          containerUpgrade: true,
          frequency: null,
          id: "foo",
          properties: {},
          quantity: 2,
        },
      ]);

      const s2 = reducer(s1, {
        payload: {
          ...lineItem,
          containerUpgrade: false,
          frequency: null,
          quantity: 1,
        },
        type: CartLineItemActionType.INCREMENT,
      });
      expect(s2.lineItems).toEqual([
        {
          ...lineItem,
          containerUpgrade: true,
          frequency: null,
          id: "foo",
          properties: {},
          quantity: 3,
        },
      ]);
    });

    it("should do nothing when action is DECREMENT and item is not in the cart", () => {
      const { lineItems } = reducer(
        { ...EMPTY_CART, lineItems: [] },
        {
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
          },
          type: CartLineItemActionType.DECREMENT,
        }
      );
      expect(lineItems).toEqual([]);
    });

    it("should remove item when action is DECREMENT and new quantity is 0", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
          },
          type: CartLineItemActionType.DECREMENT,
        }
      );
      expect(lineItems).toEqual([]);
    });

    it("should remove item when action is DECREMENT and new quantity is less than 0", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 10,
          },
          type: CartLineItemActionType.DECREMENT,
        }
      );
      expect(lineItems).toEqual([]);
    });

    it("should decrement quantity when action is DECREMENT and new quantity greater than 0", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 2,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
          },
          type: CartLineItemActionType.DECREMENT,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
      ]);
    });

    it("should remove item when action is REMOVE and it is already in the cart", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
          },
          type: CartLineItemActionType.REMOVE,
        }
      );
      expect(lineItems).toEqual([]);
    });

    it("should do nothing when action is REMOVE and item is not in the cart", () => {
      const { lineItems } = reducer(
        { ...EMPTY_CART, lineItems: [] },
        {
          payload: {
            ...lineItem,
            frequency: null,
          },
          type: CartLineItemActionType.REMOVE,
        }
      );
      expect(lineItems).toEqual([]);
    });

    it("should add item to cart when REPLACE_ALL and the cart is empty", () => {
      const { lineItems } = reducer(
        { ...EMPTY_CART, lineItems: [] },
        {
          payload: {
            ...lineItem,
            frequency: null,
            id: "foo",
            quantity: 1,
          },
          type: CartLineItemActionType.REPLACE_ALL,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          quantity: 1,
        },
      ]);
    });

    it("should replace item with new item on REPLACE_ALL", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: {
                chargeDelayDays: null,
                orderIntervalFrequency: 3,
                orderIntervalUnit: "MONTH",
              },
              id: "foo",
              quantity: 1,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            id: "bar",
            quantity: 1,
          },
          type: CartLineItemActionType.REPLACE_ALL,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: null,
          id: "bar",
          quantity: 1,
        },
      ]);
    });

    it("should add the provided frequency when action is SET_SUBSCRIPTION and the cart does not already contain a matching line item with the desired frequency", () => {
      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              quantity: 2,
            },
            {
              ...lineItem,
              frequency: {
                chargeDelayDays: null,
                orderIntervalFrequency: 3,
                orderIntervalUnit: "MONTH",
              },
              id: "bar",
              quantity: 2,
              variantId: "foo",
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            newFrequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 3,
              orderIntervalUnit: "MONTH",
            },
          },
          type: CartLineItemActionType.SET_SUBSCRIPTION,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "foo",
          quantity: 2,
        },
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "bar",
          quantity: 2,
          variantId: "foo",
        },
      ]);
    });

    it("should merge line items when action is SET_SUBSCRIPTION and the cart already contains a matching line item with the desired frequency", () => {
      const properties = {
        bar: "Sed condimentum velit sit amet",
        foo: "Lorem ipsum dolor sit amet",
      };

      const { lineItems } = reducer(
        {
          ...EMPTY_CART,
          lineItems: [
            {
              ...lineItem,
              frequency: null,
              id: "foo",
              properties: { ...properties },
              quantity: 1,
            },
            {
              ...lineItem,
              frequency: {
                chargeDelayDays: null,
                orderIntervalFrequency: 3,
                orderIntervalUnit: "MONTH",
              },
              id: "bar",
              properties: { ...properties },
              quantity: 2,
            },
          ],
        },
        {
          payload: {
            ...lineItem,
            frequency: null,
            newFrequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 3,
              orderIntervalUnit: "MONTH",
            },
            properties: { ...properties },
          },
          type: CartLineItemActionType.SET_SUBSCRIPTION,
        }
      );
      expect(lineItems).toEqual([
        {
          ...lineItem,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 3,
            orderIntervalUnit: "MONTH",
          },
          id: "foo",
          properties,
          quantity: 3,
        },
      ]);
    });
  });

  describe("getCoreCartLineItem", () => {
    it("should handle subscription products", () => {
      expect(
        getCoreCartLineItem(mockedVariant, mockedProductCore)
      ).toMatchObject(coreLineItem);
    });

    it("should handle non-subscription products", () => {
      expect(
        getCoreCartLineItem(
          {
            ...mockedVariant,
            subscriptionPriceAmount: null,
          },
          mockedProductCore
        )
      ).toMatchObject({ ...coreLineItem, subscriptionUnitPrice: null });
    });

    it("should handle nested product data", () => {
      expect(
        getCoreCartLineItem({
          ...mockedVariant,
          product: mockedProductCore,
        })
      ).toEqual(getCoreCartLineItem(mockedVariant, mockedProductCore));
    });
  });

  describe("Enhanced data", () => {
    const lineItemWithContainers = {
      ...lineItem,
      containerPrices: {
        otp: {
          base: {
            amount: "0.0",
            currencyCode: "USD",
          },
          upgrade: {
            amount: "14.99",
            currencyCode: "USD",
          },
        },
        sub: {
          base: {
            amount: "0.0",
            currencyCode: "USD",
          },
          upgrade: null,
        },
      },
    };

    it("calculates item count", () => {
      const { result: result1 } = renderHook(() => useEnhancedData([]));

      expect(result1.current.itemCount).toBe(0);

      const { result: result2 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItem,
            frequency: null,
            id: "abc",
            productId: "foo",
            quantity: 1,
            variantId: "123",
          },
          {
            ...lineItem,
            frequency: null,
            id: "def",
            productId: "bar",
            quantity: 3,
            variantId: "456",
          },
        ])
      );

      expect(result2.current.itemCount).toEqual(4);
    });

    it("returns subtotal for OTP line item, including container price", () => {
      // No containers
      const { result: result1 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItem,
            frequency: null,
            id: "abc",
            productId: "foo",
            quantity: 2,
            variantId: "123",
          },
        ])
      );

      expect(result1.current.lineItems[0].linePrice).toEqual({
        amount: "69.98",
        currencyCode: "USD",
      });

      // Free container
      const { result: result2 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItemWithContainers,
            frequency: null,
            id: "abc",
            productId: "foo",
            quantity: 2,
            variantId: "123",
          },
        ])
      );

      expect(result2.current.lineItems[0].linePrice).toEqual({
        amount: "69.98",
        currencyCode: "USD",
      });

      // Paid upgrade container
      const { result: result3 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItemWithContainers,
            containerUpgrade: true,
            frequency: null,
            id: "abc",
            productId: "product-id",
            quantity: 2,
            variantId: "variant-id",
          },
        ])
      );

      expect(result3.current.lineItems[0].linePrice).toEqual({
        amount: "84.97",
        currencyCode: "USD",
      });
    });

    it("returns subtotal for subscription line item, including container price", () => {
      // No containers
      const { result: result1 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItem,
            frequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 4,
              orderIntervalUnit: "MONTH",
            },
            id: "abc",
            productId: "foo",
            quantity: 2,
            variantId: "123",
          },
        ])
      );

      expect(result1.current.lineItems[0].linePrice).toEqual({
        amount: "59.98",
        currencyCode: "USD",
      });

      // Free container
      const { result: result2 } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItemWithContainers,
            frequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 4,
              orderIntervalUnit: "MONTH",
            },
            id: "abc",
            productId: "foo",
            quantity: 2,
            variantId: "123",
          },
        ])
      );

      expect(result2.current.lineItems[0].linePrice).toEqual({
        amount: "59.98",
        currencyCode: "USD",
      });
    });

    it("returns the shipping threshold, if configured", () => {
      const { result } = renderHook(() => useEnhancedData([]));

      expect(result.current.shippingThreshold).toBeNull();

      jest.isolateModules(() => {
        jest.resetModules();
        jest.doMock("../config", () => ({
          __esModule: true,
          default: {
            customCheckout: true,
            origin: "https://foo.bar",
            shippingThreshold: 123.45,
            subscriptions: false,
          },
        }));

        /* eslint-disable @typescript-eslint/no-var-requires */
        const { renderHook } = require("@testing-library/react-hooks");
        const { useEnhancedData } = require("../cart");

        const { result } = renderHook(() => useEnhancedData([]));

        expect(result.current.shippingThreshold).toEqual({
          amount: "123.45",
          currencyCode: "USD",
        });
      });
    });

    it("calculates subtotal for all line items", () => {
      const { result } = renderHook(() =>
        useEnhancedData([
          {
            ...lineItemWithContainers,
            frequency: null,
            id: "abc",
            productId: "foo",
            quantity: 2,
            variantId: "123",
          },
          {
            ...lineItemWithContainers,
            frequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 4,
              orderIntervalUnit: "MONTH",
            },
            id: "def",
            productId: "bar",
            quantity: 1,
            variantId: "456",
          },
          {
            ...lineItemWithContainers,
            containerUpgrade: true,
            frequency: null,
            id: "ghi",
            productId: "baz",
            quantity: 3,
            variantId: "789",
          },
        ])
      );

      expect(result.current.lineItemsSubtotalPrice).toEqual({
        amount: "219.93",
        currencyCode: "USD",
      });
    });

    it("appends the appropriate product container", () => {
      const containers = {
        otp: {
          base: {
            compareAtPrice: null,
            image: {
              height: 1024,
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg1NjU0MzQyNjk3NzQ=",
              url: "https://cdn.shopify.com/fake/card-tube.jpg",
              width: 1024,
            },
            price: {
              amount: "0.0",
              currencyCode: "USD",
            },
            productId: "otp-container-product-id",
            title: "Card tube",
            variantId: "otp-container-variant-id",
          },
          upgrade: {
            compareAtPrice: null,
            image: {
              height: 1024,
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg1NjU0MzQyNjk3NzQ=",
              url: "https://cdn.shopify.com/fake/premium-tin.jpg",
              width: 1024,
            },
            price: {
              amount: "14.99",
              currencyCode: "USD",
            },
            productId: "sub-container-product-id",
            title: "Premium tin",
            variantId: "sub-container-variant-id",
          },
        },
        sub: {
          base: {
            compareAtPrice: {
              amount: "14.99",
              currencyCode: "USD",
            },
            image: {
              height: 1024,
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMjg1NjU0MzQyNjk3NzQ=",
              url: "https://cdn.shopify.com/fake/premium-tin.jpg",
              width: 1024,
            },
            price: {
              amount: "0.0",
              currencyCode: "USD",
            },
            productId: "sub-container-product-id",
            title: "Premium tin",
            variantId: "sub-container-variant-id",
          },
          upgrade: null,
        },
      };

      const variants = [
        {
          ...mockedVariant,
          id: "123",
          product: { ...mockedProductCore, containers },
        },
        {
          ...mockedVariant,
          id: "456",
          product: { ...mockedProductCore, containers },
        },
        {
          ...mockedVariant,
          id: "789",
          product: { ...mockedProductCore, containers },
        },
      ];

      const { result } = renderHook(() =>
        useEnhancedData(
          [
            {
              ...lineItem,
              frequency: null,
              id: "abc",
              productId: "foo",
              quantity: 2,
              variantId: "123",
            },
            {
              ...lineItem,
              frequency: {
                chargeDelayDays: null,
                orderIntervalFrequency: 4,
                orderIntervalUnit: "MONTH",
              },
              id: "def",
              productId: "bar",
              quantity: 1,
              variantId: "456",
            },
            {
              ...lineItem,
              containerUpgrade: true,
              frequency: null,
              id: "ghi",
              productId: "baz",
              quantity: 3,
              variantId: "789",
            },
          ],
          {
            variants,
          }
        )
      );

      expect(result.current.lineItems).toHaveLength(3);

      result.current.lineItems.forEach((lineItem) => {
        if (!("container" in lineItem)) {
          throw new Error("Missing container data");
        }

        expect(lineItem.container).toMatchSnapshot();
      });
    });

    it("appends detailed variant information, when available", () => {
      const variant = {
        ...mockedVariant,
        id: "123",
        product: mockedProductCore,
      };

      const { result } = renderHook(() =>
        useEnhancedData(
          [
            {
              ...lineItem,
              frequency: null,
              id: "abc",
              productId: "foo",
              quantity: 2,
              variantId: "123",
            },
            {
              ...lineItem,
              frequency: {
                chargeDelayDays: null,
                orderIntervalFrequency: 4,
                orderIntervalUnit: "MONTH",
              },
              id: "def",
              productId: "bar",
              quantity: 1,
              variantId: "456",
            },
          ],
          {
            variants: [variant],
          }
        )
      );

      expect(result.current.lineItems[0]).toMatchObject({ variant });
      expect("variant" in result.current.lineItems[1]).toBe(false);
    });

    it("updates stale cart data", () => {
      const variant = {
        ...mockedVariant,
        id: "123",
        product: mockedProductCore,
      };

      const { result } = renderHook(() =>
        useEnhancedData(
          [
            {
              containerPrices: null,
              frequency: null,
              handle: "old",
              id: "abc",
              imageUrl: "https://cdn.shopify.com/mock-image/old-variant-4.jpg",
              productId: "456",
              properties: {},
              quantity: 2,
              subscriptionUnitPrice: {
                amount: "11.11",
                currencyCode: "USD",
              },
              subtitle: "Old Subtitle",
              title: "Old Title",
              unitPrice: {
                amount: "12.34",
                currencyCode: "USD",
              },
              variantId: "123",
            },
          ],
          {
            variants: [variant],
          }
        )
      );

      expect(result.current).toMatchSnapshot();
    });
  });

  describe("Hook and provider", () => {
    const EXAMPLE_CART: StoredCartState = {
      checkoutId: null,
      customAttributes: {},
      discountCode: null,
      id: "cart123",
      lineItems: [
        {
          ...lineItem,
          frequency: null,
          id: "foo",
          productId: "product678",
          quantity: 1,
          variantId: "variant901",
        },
      ],
      rCheckoutId: "checkout456",
      version: CART_STATE_VERSION,
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CHECKOUT_COMPLETED_CORE,
          variables: { id: "checkout456" },
        },
        result: {
          data: {
            rCheckout: {
              completedAt: "some time ago",
              id: "RCheckout-1",
            },
          },
        },
      },
      {
        delay: 1,
        request: {
          query: VARIANT_INFO,
          variables: { ids: ["variant123"] },
        },
        result: {
          data: {
            variants: [
              {
                ...mockedVariant,
                id: "variant123",
                product: mockedProductCore,
              },
            ],
          },
        },
      },
    ];

    const wrapper: FC = ({ children }) => (
      // Disable cache in order to silence deprecation warnings (see
      // https://github.com/apollographql/react-apollo/issues/1747#issuecomment-603444537)
      <MockApolloProvider
        mocks={mocks}
        addTypename={false}
        defaultOptions={{
          query: { fetchPolicy: "no-cache" },
          watchQuery: { fetchPolicy: "no-cache" },
        }}
      >
        <CartProvider>{children}</CartProvider>
      </MockApolloProvider>
    );

    afterEach(() => {
      store.clearAll();
    });

    it("throws when called from outside of CartProvider", () => {
      const { result } = renderHook(() => useCart());
      expect(() => result.current).toThrow();
    });

    it("sets cart id upon startup", async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.itemCount).toBe(0);
      expect(result.current.lineItems).toEqual([]);
      expect(result.current.lineItemsSubtotalPrice).toEqual({
        amount: "0.0",
        currencyCode: "USD",
      });
      expect(result.current.status).toBe(CartStatus.READY);

      const savedCart = store.get("cart");
      expect(savedCart).toMatchObject({
        checkoutId: null,
        id: expect.any(String),
        lineItems: [],
        rCheckoutId: null,
        version: CART_STATE_VERSION,
      });
    });

    it("allow assigning a checkout to cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const { checkoutId: checkoutIdBefore } = store.get("cart");
      expect(checkoutIdBefore).toBe(null);

      act(() => {
        result.current.associateCheckout({ checkoutId: "checkout123" });
      });

      const { checkoutId: checkoutIdAfter } = store.get("cart");
      expect(checkoutIdAfter).toEqual("checkout123");
    });

    it("allow assigning a ReCharge checkout to cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const { rCheckoutId: rCheckoutIdBefore } = store.get("cart");
      expect(rCheckoutIdBefore).toBe(null);

      act(() => {
        result.current.associateCheckout({ rCheckoutId: "checkout123" });
      });

      const { rCheckoutId: rCheckoutIdAfter } = store.get("cart");
      expect(rCheckoutIdAfter).toEqual("checkout123");
    });

    it("returns synchronously calculated values immediately", async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      act(() => {
        result.current.lineItemUpdate({
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
            variantId: "variant123",
          },
          type: CartLineItemActionType.INCREMENT,
        });
      });

      expect(result.current.itemCount).toEqual(1);
      expect(result.current.lineItemsSubtotalPrice).toEqual({
        amount: "34.99",
        currencyCode: "USD",
      });
    });

    it("retrieves per-variant information such as skus, titles, ...", async () => {
      const { result, waitForNextUpdate } = renderHook(() => useCart(), {
        wrapper,
      });

      expect(result.current.status).toBe(CartStatus.READY);
      expect(result.current.lineItemsSavingsPrice).toMatchSnapshot();

      act(() => {
        result.current.lineItemUpdate({
          payload: {
            ...lineItem,
            frequency: null,
            quantity: 1,
            variantId: "variant123",
          },
          type: CartLineItemActionType.INCREMENT,
        });
      });

      expect(result.current.status).toBe(CartStatus.FETCHING);
      expect(result.current.lineItems).toMatchSnapshot();
      expect(result.current.lineItemsSavingsPrice).toBeNull();

      await waitForNextUpdate();

      expect(result.current.status).toBe(CartStatus.READY);
      expect(result.current.lineItems).toMatchSnapshot();
      expect(result.current.lineItemsSavingsPrice).toMatchSnapshot();
    });

    it("allow replacing a cart (e.g. abandoned cart restoration)", async () => {
      store.set("cart", EXAMPLE_CART);
      const replacementCart = {
        ...EXAMPLE_CART,
        id: null,
        rCheckoutId: "checkout789",
      };

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      act(() => {
        result.current.replace(replacementCart);
      });

      const updatedCart = store.get("cart");

      expect(updatedCart).toMatchObject({
        ...replacementCart,
        id: expect.any(String),
      });
    });

    it("allow resetting cart (e.g. after payment)", async () => {
      store.set("cart", EXAMPLE_CART);

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      act(() => {
        result.current.reset();
      });

      const { id, lineItems } = store.get("cart");

      expect(id).not.toEqual("cart123");
      expect(lineItems).toEqual([]);
    });

    it("if cart refers to a started checkout, queries backend to see if checkout was completed, if so clears the cart", async () => {
      store.set("cart", EXAMPLE_CART);

      const { result, waitForNextUpdate } = renderHook(() => useCart(), {
        wrapper,
      });

      await waitForNextUpdate();

      expect(result.current.itemCount).toEqual(0);

      const savedCart = store.get("cart");
      expect(savedCart).toMatchObject({
        checkoutId: null,
        lineItems: [],
        rCheckoutId: null,
      });
    });

    it("restores from localstorage if available", async () => {
      const STORED_CART: StoredCartState = {
        checkoutId: null,
        customAttributes: {
          foo: "bar",
        },
        discountCode: "SAVE",
        id: "cart123",
        lineItems: [
          {
            ...lineItem,
            frequency: null,
            id: "foo",
            productId: "productABC",
            quantity: 1,
            variantId: "variant123",
          },
        ],
        rCheckoutId: null,
        version: CART_STATE_VERSION,
      };

      store.set("cart", STORED_CART);

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      expect(result.current).toMatchSnapshot();
    });

    it("ignores and clears localStorage if old version was found", () => {
      const STORED_CART: StoredCartState = {
        checkoutId: null,
        customAttributes: {
          foo: "bar",
        },
        discountCode: "SAVE",
        id: "cart123",
        lineItems: [
          {
            ...lineItem,
            frequency: null,
            id: "foo",
            productId: "productABC",
            quantity: 1,
            variantId: "variant123",
          },
        ],
        rCheckoutId: null,
        version: 0,
      };

      store.set("cart", STORED_CART);

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      expect(result.current).toMatchObject({
        checkoutId: null,
        customAttributes: {},
        discountCode: null,
        id: expect.any(String),
        lineItems: [],
        rCheckoutId: null,
      });
      expect(store.get("cart")).toEqual({
        checkoutId: null,
        customAttributes: {},
        discountCode: null,
        id: expect.any(String),
        lineItems: [],
        rCheckoutId: null,
        version: CART_STATE_VERSION,
      });
    });

    it("allows setting cart custom attributes", async () => {
      store.set("cart", EXAMPLE_CART);

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      act(() => {
        result.current.setCustomAttributes({ a: "b" });
      });

      expect(result.current.customAttributes).toEqual({ a: "b" });
    });

    it("allows setting discount codes", async () => {
      store.set("cart", EXAMPLE_CART);

      const { result } = renderHook(() => useCart(), {
        wrapper,
      });

      expect(result.current.discountCode).toBeNull();

      act(() => {
        result.current.setDiscountCode("FOO");
      });

      expect(result.current.discountCode).toBe("FOO");

      act(() => {
        result.current.setDiscountCode(null);
      });

      expect(result.current.discountCode).toBeNull();
    });
  });

  describe("getHasSubscription", () => {
    const otpMock = ({
      lineItems: [
        {
          frequency: null,
        },
        {
          frequency: null,
        },
        {
          frequency: null,
        },
      ],
    } as unknown) as CartState;
    const subscriptionMock = ({
      lineItems: [
        {
          frequency: null,
        },
        {
          frequency: {
            orderIntervalFrequency: 30,
            orderIntervalUnit: "DAY",
          },
        },
        {
          frequency: null,
        },
      ],
    } as unknown) as CartState;

    it("should return `true` if any line items are subscriptions", () => {
      expect(getHasSubscription(subscriptionMock)).toBe(true);
    });

    it("should return `false` if no line items are subscriptions", () => {
      expect(getHasSubscription(otpMock)).toBe(false);
    });
  });
});
