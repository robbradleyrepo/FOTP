import { createApolloClient } from "@sss/apollo/testing";

import type { EnhancedCartLineItem } from "../cart";
import {
  cartLineitemsToCheckoutInput,
  Checkout,
  CHECKOUT_UPDATE,
  CheckoutUpdateData,
  CheckoutUpdateInput,
  getDefaultShippingRate,
  getUpdatedNoteAttributes,
} from "../checkout";
import { mockedResponses } from "../testing";
import { PRODUCT_ID, VARIANT_ID } from "../testing/queries/checkout";

describe("checkout update mock queries", () => {
  it("should add billing", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addBillingAddress,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        billingAddress: {
          address: {
            address1: "Industrious, 6060 Center Drive",
            address2: "Floor 10",
            city: "Los Angeles",
            company: "FOTP",
            countryCode: "US",
            firstName: "John",
            lastName: "Doe",
            phone: "",
            province: "California",
            zip: "90045-1598",
          },
        },
      },
    });

    expect(data?.payload.rCheckout?.billingAddress).toMatchObject({
      address1: "Industrious, 6060 Center Drive",
      address2: "Floor 10",
      city: "Los Angeles",
      company: "FOTP",
      country: "United States",
      countryCode: "US",
      firstName: "John",
      lastName: "Doe",
      phone: "",
      province: "California",
      zip: "90045-1598",
    });
  });

  it("should add discount", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addDiscount,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        discount: {
          code: "EXTRA10",
        },
      },
    });

    expect(data?.payload.rCheckout?.discount).toMatchObject({
      amount: {
        amount: "3.44",
        currencyCode: "USD",
      },
      applicable: true,
      code: "EXTRA10",
      reason: null,
      type: "FIXED_AMOUNT",
      value: 3.44,
    });
  });

  it("should add email", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addEmail,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        email: {
          acceptsEmailMarketing: true,
          email: "user@example.com",
        },
      },
    });

    expect(data?.payload.rCheckout?.email).toEqual("user@example.com");
    expect(data?.payload.rCheckout?.acceptsEmailMarketing).toEqual(true);
  });

  it("should replace line item", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.replaceLineItems,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        lineItems: [
          {
            frequency: {
              chargeDelayDays: null,
              orderIntervalFrequency: 30,
              orderIntervalUnit: "DAY",
            },
            productId: PRODUCT_ID,
            properties: [],
            quantity: 1,
            variantId: VARIANT_ID,
          },
        ],
      },
    });

    expect(data?.payload.rCheckout?.lineItems.length).toEqual(1);
    expect(data?.payload.rCheckout?.lineItems).toMatchSnapshot();
  });

  it("should add shipping", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addShippingAddress,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        shippingAddress: {
          address: {
            address1: "Industrious, 6060 Center Drive",
            address2: "Floor 10",
            city: "Los Angeles",
            company: "FOTP",
            countryCode: "US",
            firstName: "John",
            lastName: "Doe",
            phone: "",
            province: "California",
            zip: "90045-1598",
          },
        },
      },
    });

    expect(data?.payload.rCheckout?.shippingAddress).toMatchObject({
      address1: "Industrious, 6060 Center Drive",
      address2: "Floor 10",
      city: "Los Angeles",
      company: "FOTP",
      country: "United States",
      countryCode: "US",
      firstName: "John",
      lastName: "Doe",
      phone: "",
      province: "California",
      zip: "90045-1598",
    });
    expect(data?.payload.rCheckout?.availableShippingRates).toMatchObject({
      ready: true,
      shippingRates: {
        handle: "rate",
        price: {
          amount: "0",
          currencyCode: "USD",
        },
        title: "Free US Shipping",
      },
    });
  });

  it("should add shipping", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addShippingHandle,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        shippingRate: {
          handle: "rate",
        },
      },
    });

    expect(data?.payload.rCheckout?.shippingRate).toMatchObject({
      handle: "rate",
      price: {
        amount: "0",
        currencyCode: "USD",
      },
      title: "Free US Shipping",
    });
  });

  it("should add note attributes", async () => {
    const client = createApolloClient([
      mockedResponses.checkoutUpdate.addNoteAttributes,
    ]);

    const { data } = await client.mutate<
      CheckoutUpdateData,
      CheckoutUpdateInput
    >({
      mutation: CHECKOUT_UPDATE,
      variables: {
        noteAttributes: [{ name: "ajsAnonymousId", value: "123" }],
      },
    });

    expect(data?.payload.rCheckout?.noteAttributes).toMatchObject([
      { name: "ajsAnonymousId", value: "123" },
    ]);
  });
});

describe("cartLineitemsToCheckoutInput", () => {
  it("should map cart line item values to a valid checkout line item input", () => {
    expect(
      cartLineitemsToCheckoutInput([
        {
          container: null,
          frequency: null,
          id: "cart-line-item-123",
          quantity: 12,
          variant: {
            id: "variant-123",
            product: {
              id: "product-123",
            },
          },
        },
        {
          container: null,
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 30,
            orderIntervalUnit: "DAY",
          },
          id: "cart-line-item-456",
          quantity: 34,
          variant: {
            id: "variant-456",
            product: {
              id: "product-456",
            },
          },
        },
      ] as EnhancedCartLineItem[])
    ).toMatchSnapshot();
  });

  it("should map cart line items' containers to separate checkout line items", () => {
    expect(
      cartLineitemsToCheckoutInput([
        {
          container: {
            productId: "container-product-123",
            variantId: "container-variant-123",
          },
          frequency: null,
          id: "cart-line-item-123",
          quantity: 12,
          variant: {
            id: "variant-123",
            product: {
              id: "product-123",
            },
          },
        },
        {
          container: {
            productId: "container-product-123",
            variantId: "container-variant-123",
          },
          frequency: {
            chargeDelayDays: null,
            orderIntervalFrequency: 30,
            orderIntervalUnit: "DAY",
          },
          id: "cart-line-item-456",
          quantity: 34,
          variant: {
            id: "variant-456",
            product: {
              id: "product-456",
            },
          },
        },
      ] as EnhancedCartLineItem[])
    ).toMatchSnapshot();
  });
});

describe("getDefaultShippingRate", () => {
  it("should return the cheapest shipping method", () => {
    const expectedDefault = {
      handle: "default",
      price: {
        amount: "0.00",
        currencyCode: "USD",
      },
      title: "Free shipping",
    };
    const rates = [
      {
        handle: "cheap",
        price: {
          amount: "0.01",
          currencyCode: "USD",
        },
        title: "Cheap shipping",
      },
      expectedDefault,
      {
        handle: "expensive",
        price: {
          amount: "1000.00",
          currencyCode: "USD",
        },
        title: "Expensive shipping",
      },
    ];

    expect(getDefaultShippingRate(rates)).toBe(expectedDefault);
  });

  it("should return `null` if there are no shipping methods", () => {
    expect(getDefaultShippingRate([])).toBeNull();
  });
});

describe("getUpdatedNoteAttributes", () => {
  const mockCheckout = {
    noteAttributes: [{ name: "foo", value: "Foo" }],
  } as Checkout;

  it("should return an array of properties that includes the existing notes and provided attributes", () => {
    expect(getUpdatedNoteAttributes(mockCheckout, { bar: "Bar" })).toEqual([
      { name: "foo", value: "Foo" },
      { name: "bar", value: "Bar" },
    ]);
  });

  it("should replace existing entries with new values", () => {
    expect(
      getUpdatedNoteAttributes(mockCheckout, { bar: "Bar", foo: "Baz" })
    ).toEqual([
      { name: "foo", value: "Baz" },
      { name: "bar", value: "Bar" },
    ]);
  });

  it("should note include unwanted properties", () => {
    const mockDirtyCheckout = ({
      noteAttributes: [
        { __typename: "RProperties", name: "foo", value: "Foo" },
      ],
    } as unknown) as Checkout;

    expect(getUpdatedNoteAttributes(mockDirtyCheckout, { bar: "Bar" })).toEqual(
      [
        { name: "foo", value: "Foo" },
        { name: "bar", value: "Bar" },
      ]
    );
  });
});
