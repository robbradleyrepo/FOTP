/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from "@apollo/react-testing";
import cloneDeep from "lodash.clonedeep";

import {
  CHECKOUT,
  CHECKOUT_COMPLETED_CORE,
  CHECKOUT_WITH_VARIANTS,
} from "../../checkout";
import productQueries from "./product";

export const CHECKOUT_ID = "1";
export const PRODUCT_ID = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE=";
export const VARIANT_ID = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8x";

const empty: MockedResponse = {
  request: {
    query: CHECKOUT,
  },
  result: {
    data: {
      rCheckout: {
        __typename: "RCheckout",
        acceptsEmailMarketing: false,
        availableShippingRates: {
          __typename: "RAvailableShippingRates",
          ready: false,
          shippingRates: null,
        },
        billingAddress: null,
        completedAt: null,
        customer: null,
        discount: null,
        email: null,
        id: CHECKOUT_ID,
        itemCount: 0,
        lineItems: [],
        lineItemsSubtotalPrice: {
          __typename: "MoneyV2",
          amount: "0.00",
          currencyCode: "USD",
        },
        noteAttributes: null,
        rOrders: null,
        ready: false,
        shippingAddress: null,
        shippingRate: null,
        subtotalPrice: {
          __typename: "MoneyV2",
          amount: "0.00",
          currencyCode: "USD",
        },
        taxLines: null,
        taxesIncluded: false,
        totalDiscounts: {
          __typename: "MoneyV2",
          amount: "0",
          currencyCode: "USD",
        },
        totalPrice: {
          __typename: "MoneyV2",
          amount: "0.00",
          currencyCode: "USD",
        },
        totalShipping: {
          __typename: "MoneyV2",
          amount: "0",
          currencyCode: "USD",
        },
        totalTax: {
          __typename: "MoneyV2",
          amount: "0.00",
          currencyCode: "USD",
        },
        transaction: null,
        webUrl: "https://test-us-buy.fotp.com/r/checkout/1",
      },
    },
  },
};

const none: MockedResponse = {
  request: {
    query: CHECKOUT,
  },
  result: {
    data: {
      rCheckout: null,
    },
  },
};

const one: MockedResponse = {
  request: {
    query: CHECKOUT,
  },
  result: {
    data: {
      rCheckout: {
        __typename: "RCheckout",
        acceptsEmailMarketing: false,
        availableShippingRates: {
          __typename: "RAvailableShippingRates",
          ready: false,
          shippingRates: null,
        },
        billingAddress: null,
        completedAt: null,
        customer: null,
        discount: null,
        email: null,
        id: CHECKOUT_ID,
        itemCount: 1,
        lineItems: [
          {
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
            linePrice: {
              __typename: "MoneyV2",
              amount: "34.37",
              currencyCode: "USD",
            },
            price: {
              __typename: "MoneyV2",
              amount: "34.37",
              currencyCode: "USD",
            },
            productId: PRODUCT_ID,
            productType: "",
            properties: [],
            quantity: 1,
            sku: "FPTO01-PH",
            title: "The One",
            variantId: VARIANT_ID,
            variantTitle: "1 pouch",
            vendor: "Front Of The Pack",
          },
        ],
        lineItemsSubtotalPrice: {
          __typename: "MoneyV2",
          amount: "34.37",
          currencyCode: "USD",
        },
        noteAttributes: null,
        rOrders: null,
        ready: false,
        shippingAddress: null,
        shippingRate: null,
        subtotalPrice: {
          __typename: "MoneyV2",
          amount: "34.37",
          currencyCode: "USD",
        },
        taxLines: null,
        taxesIncluded: false,
        totalDiscounts: {
          __typename: "MoneyV2",
          amount: "0",
          currencyCode: "USD",
        },
        totalPrice: {
          __typename: "MoneyV2",
          amount: "34.37",
          currencyCode: "USD",
        },
        totalShipping: {
          __typename: "MoneyV2",
          amount: "0",
          currencyCode: "USD",
        },
        totalTax: {
          __typename: "MoneyV2",
          amount: "0.00",
          currencyCode: "USD",
        },
        transaction: null,
        webUrl: "https://test-us-buy.fotp.com/r/checkout/1",
      },
    },
  },
};

const restoreCompletedCoreSuccess: MockedResponse = {
  request: {
    query: CHECKOUT_COMPLETED_CORE,
    variables: { id: "1" },
  },
  result: {
    data: {
      rCheckout: {
        completedAt: "1970-01-01T00:00:00.000Z",
        id: "1",
      },
    },
  },
};

const restoreCompletedCoreFail: MockedResponse = {
  request: {
    query: CHECKOUT_COMPLETED_CORE,
    variables: { id: "1" },
  },
  result: {
    data: {
      rCheckout: null,
    },
  },
};

const restoreFail: MockedResponse = {
  request: {
    query: CHECKOUT_WITH_VARIANTS,
    variables: { id: "1" },
  },
  result: {
    data: {
      rCheckout: null,
    },
  },
};

const restoreSuccess: MockedResponse = {
  request: {
    query: CHECKOUT_WITH_VARIANTS,
    variables: { id: "1" },
  },
  result: {
    data: {
      rCheckout: {
        ...cloneDeep((one as any).result.data.rCheckout),
        lineItems: (one as any).result.data.rCheckout.lineItems.map(
          (lineItem: any) => ({
            ...lineItem,
            product: { ...productQueries.productCoreFragment, id: PRODUCT_ID },
            variant: { ...productQueries.variantFragment, id: VARIANT_ID },
          })
        ),
        noteAttributes: [
          {
            __typename: "RProperties",
            name: "key",
            value: "val",
          },
        ],
      },
    },
  },
};

export default {
  empty,
  none,
  one,
  restoreCompletedCoreFail,
  restoreCompletedCoreSuccess,
  restoreFail,
  restoreSuccess,
};
