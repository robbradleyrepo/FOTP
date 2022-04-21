import { CartStatus } from "../../cart";
import { CartOffer, getApplicableCartOffer } from "../cart";

describe("getApplicableCartOffer", () => {
  const bar: CartOffer = {
    handle: "get-bar",
    include: {
      skus: ["baz-x1", "baz-x2", "baz-x3", "foo-x1", "foo-x2", "foo-x3"],
    },
    products: ["bar"],
  };
  const baz: CartOffer = {
    handle: "get-baz",
    include: {
      skus: ["bar-x1", "bar-x2", "bar-x3", "foo-x1", "foo-x2", "foo-x3"],
    },
    products: ["baz"],
  };
  const foo: CartOffer = {
    exclude: { handles: ["fooish"] },
    handle: "get-foo",
    include: {
      skus: ["bar-x1", "bar-x2", "bar-x3", "baz-x1", "baz-x2", "baz-x3"],
    },
    products: ["foo"],
  };

  const offers = [foo, bar, baz];

  it("should return the first offer that applies to the provided SKU if there are no items in the cart", () => {
    expect(
      getApplicableCartOffer({
        cart: { lineItems: [], status: CartStatus.READY },
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
      })
    ).toBe(bar);
  });

  it("should not return an offer for a product that is already in the cart", () => {
    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [{ variant: { product: { handle: "bar" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
      })
    ).toBe(baz);

    expect(
      getApplicableCartOffer({
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
        sku: "foo-x1",
      })
    ).toBeNull();
  });

  it("should not return an offer for an add-on product", () => {
    expect(
      getApplicableCartOffer({
        addOns: ["bar"],
        cart: { lineItems: [], status: CartStatus.READY },
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
      })
    ).toBe(baz);

    expect(
      getApplicableCartOffer({
        addOns: ["bar"],
        cart: {
          lineItems: [{ variant: { product: { handle: "baz" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
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
      sku: "bar-x1",
    };

    expect(getApplicableCartOffer(params)).toBe(foo);

    expect(
      getApplicableCartOffer({
        ...params,
        cart: {
          ...params.cart,
          lineItems: [{ variant: { product: { handle: "fooish" } } }] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
        },
      })
    ).toBe(baz);
  });

  it("should not return an offer if an add-on product is blacklisted", () => {
    const params = {
      addOns: ["blah"],
      cart: { lineItems: [], status: CartStatus.READY },
      offers,
      product: { handle: "bar" },
      query: {},
      sku: "bar-x1",
    };

    expect(getApplicableCartOffer(params)).toBe(foo);

    expect(
      getApplicableCartOffer({
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
      getApplicableCartOffer({
        cart: { lineItems: [], status: CartStatus.FETCHING },
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
      })
    ).toBeNull();
  });

  it("should not return any offers if the current product is already in the cart", () => {
    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [{ variant: { product: { handle: "foo" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: {},
        sku: "foo-x1",
      })
    ).toBeNull();
  });

  it("should not return any offers if the `cart_offers` query param is `false`", () => {
    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [],
          status: CartStatus.READY,
        },
        offers,
        product: { handle: "foo" },
        query: { cart_offers: "false" },
        sku: "foo-x1",
      })
    ).toBeNull();
  });

  it("should ignore the `cart_offers` query param if it is `true`", () => {
    const params = {
      cart: {
        lineItems: [],
        status: CartStatus.READY,
      },
      offers,
      product: { handle: "foo" },
      query: {},
      sku: "foo-x1",
    };
    const result = getApplicableCartOffer(params);

    expect(result).not.toBeNull();
    expect(result).toBe(
      getApplicableCartOffer({ ...params, query: { cart_offers: "true" } })
    );
  });

  it("should the use the offer specified by the `cart_offers` query param instead of the offer config", () => {
    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [],
          status: CartStatus.READY,
        },
        offers,
        product: { handle: "foo" },
        query: { cart_offers: "get-baz" },
        sku: "foo-x1",
      })
    ).toBe(baz);

    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [{ variant: { product: { handle: "baz" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: { cart_offers: "get-baz" },
        sku: "foo-x1",
      })
    ).toBeNull();

    expect(
      getApplicableCartOffer({
        cart: {
          lineItems: [{ variant: { product: { handle: "foo" } } }],
          status: CartStatus.READY,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        offers,
        product: { handle: "foo" },
        query: { cart_offers: "get-baz" },
        sku: "foo-x1",
      })
    ).toBeNull();
  });
});
