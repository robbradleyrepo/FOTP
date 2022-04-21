/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from "@apollo/react-testing";
import cloneDeep from "lodash.clonedeep";

import { CHECKOUT_UPDATE } from "../../checkout";
import queries, { PRODUCT_ID, VARIANT_ID } from "./checkout";

const { one } = queries;

const addBillingAddress: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
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
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep((one as any).result.data.rCheckout),
          billingAddress: {
            __typename: "RAddress",
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
          },
        },
        userErrors: [],
      },
    },
  },
};

const addDiscount: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
    variables: {
      discount: {
        code: "EXTRA10",
      },
    },
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep((one as any).result.data.rCheckout),
          discount: {
            __typename: "RCheckoutDiscount",
            amount: {
              __typename: "MoneyV2",
              amount: "3.44",
              currencyCode: "USD",
            },
            applicable: true,
            code: "EXTRA10",
            reason: null,
            type: "FIXED_AMOUNT",
            value: 3.44,
          },
          totalDiscounts: {
            __typename: "MoneyV2",
            amount: "3.44",
            currencyCode: "USD",
          },
          totalPrice: {
            __typename: "MoneyV2",
            amount: "30.93",
            currencyCode: "USD",
          },
        },
        userErrors: [],
      },
    },
  },
};

const addEmail: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
    variables: {
      email: {
        acceptsEmailMarketing: true,
        email: "user@example.com",
      },
    },
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep((queries.one as any).result.data.rCheckout),
          acceptsEmailMarketing: true,
          email: "user@example.com",
        },
        userErrors: [],
      },
    },
  },
};

const replaceLineItems: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
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
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: cloneDeep((queries.one as any).result.data.rCheckout),
        userErrors: [],
      },
    },
  },
};

const addShippingAddress: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
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
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep((queries.one as any).result.data.rCheckout),
          availableShippingRates: {
            __typename: "RAvailableShippingRates",
            ready: true,
            shippingRates: {
              __typename: "RShippingRate",
              handle: "rate",
              price: {
                __typename: "MoneyV2",
                amount: "0",
                currencyCode: "USD",
              },
              title: "Free US Shipping",
            },
          },
          shippingAddress: {
            __typename: "RAddress",
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
          },
        },
        userErrors: [],
      },
    },
  },
};

const addShippingHandle: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
    variables: {
      shippingRate: {
        handle: "rate",
      },
    },
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep(
            (addShippingAddress as any).result.data.payload.rCheckout
          ),
          shippingRate: {
            __typename: "RShippingRate",
            handle: "rate",
            price: {
              __typename: "MoneyV2",
              amount: "0",
              currencyCode: "USD",
            },
            title: "Free US Shipping",
          },
        },
        userErrors: [],
      },
    },
  },
};

const addNoteAttributes: MockedResponse = {
  request: {
    query: CHECKOUT_UPDATE,
    variables: {
      noteAttributes: [{ name: "ajsAnonymousId", value: "123" }],
    },
  },
  result: {
    data: {
      payload: {
        __typename: "RCheckoutPayload",
        rCheckout: {
          ...cloneDeep(
            (addShippingAddress as any).result.data.payload.rCheckout
          ),
          noteAttributes: [
            { __typename: "RProperties", name: "ajsAnonymousId", value: "123" },
          ],
        },
        userErrors: [],
      },
    },
  },
};

export default {
  addBillingAddress,
  addDiscount,
  addEmail,
  addNoteAttributes,
  addShippingAddress,
  addShippingHandle,
  replaceLineItems,
};
