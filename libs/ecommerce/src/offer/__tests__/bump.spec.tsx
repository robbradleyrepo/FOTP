import {
  MockedProvider as MockApolloProvider,
  MockedResponse,
} from "@apollo/react-testing";
import * as ecommerce from "@sss/ecommerce/testing";
import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";

import { CartProvider, CartStatus } from "../../cart";
import { BumpOffer, getApplicableBumpOffer, useBumpOffer } from "../bump";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));

describe("getApplicableBumpOffer", () => {
  const bar: BumpOffer = {
    include: {
      handles: ["baz", "foo"],
    },
    product: { handle: "bar", sku: "bar-x1" },
  };
  const baz: BumpOffer = {
    include: {
      handles: ["bar", "foo"],
    },
    product: { handle: "baz", sku: "baz-x1" },
  };
  const foo: BumpOffer = {
    exclude: { handles: ["fooish"] },
    include: { handles: ["bar", "baz"] },
    product: { handle: "foo", sku: "foo-x1" },
  };

  const offers = [foo, bar, baz];

  it("should return the first offer that applies to the provided product if there are no items in the cart", () => {
    expect(
      getApplicableBumpOffer({
        cart: { lineItems: [], status: CartStatus.READY },
        offers,
        product: { handle: "foo" },
        query: {},
      })
    ).toBe(bar);
  });

  it("should not return an offer for a product that is already in the cart", () => {
    expect(
      getApplicableBumpOffer({
        cart: {
          lineItems: [{ variant: { product: { handle: "bar" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: {},
      })
    ).toBe(baz);

    expect(
      getApplicableBumpOffer({
        cart: {
          lineItems: [
            { variant: { product: { handle: "bar" } } },
            { variant: { product: { handle: "baz" } } },
          ],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: {},
      })
    ).toBeNull();
  });

  it("should not return an offer if the cart contains a blacklisted product", () => {
    const params = {
      cart: {
        lineItems: [{ variant: { product: { handle: "blah" } } }],
        status: CartStatus.READY,
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      offers,
      product: { handle: "bar" },
      query: {},
    };

    expect(getApplicableBumpOffer(params)).toBe(foo);

    expect(
      getApplicableBumpOffer({
        ...params,
        cart: {
          ...params.cart,
          lineItems: [{ variant: { product: { handle: "fooish" } } }] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
        },
      })
    ).toBe(baz);
  });

  it("should not return any offers if complete cart data is not available", () => {
    expect(
      getApplicableBumpOffer({
        cart: { lineItems: [], status: CartStatus.FETCHING },
        offers,
        product: { handle: "foo" },
        query: {},
      })
    ).toBeNull();
  });
});

describe("useBumpOffer", () => {
  const NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    (process.env.NODE_ENV as unknown) = NODE_ENV;
  });

  const mocks: MockedResponse[] = [
    {
      delay: 1,
      ...ecommerce.mockedResponses.product.productByHandle,
    },
  ];

  const wrapper: FC = ({ children }) => (
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

  it("should return the first applicable bump offer and fetch its product data", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "move", sku: "move" },
            },
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "fake", sku: "fake" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.all).toMatchSnapshot();
  });

  it("should return null for the bump offer if the applicable offer is unavailable for sale", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "move", sku: "move" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.all).toMatchSnapshot();
  });

  it("should return an error status if the data fails to load", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "missing", sku: "missing" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.all).toMatchSnapshot();
  });

  it("should return an error status in production if the bump product does not include the specified variant", async () => {
    (process.env.NODE_ENV as string) = "production";

    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "move", sku: "missing" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.all).toMatchSnapshot();
  });

  it("should return throw an error in a non-production environment if the bump product does not include the specified variant", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["foo"],
              },
              product: { handle: "move", sku: "missing" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(() => result.current).toThrow();
  });

  it("should return a `null` offer if there is no valid offer for the current product", async () => {
    const { result } = renderHook(
      () =>
        useBumpOffer({
          offers: [
            {
              include: {
                handles: ["bar"],
              },
              product: { handle: "move", sku: "move" },
            },
          ],
          product: { handle: "foo" },
        }),
      { wrapper }
    );

    expect(result.all).toMatchSnapshot();
  });
});
