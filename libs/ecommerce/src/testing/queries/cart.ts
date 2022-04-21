/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedResponse } from "@apollo/react-testing";

import { VARIANT_INFO } from "../../cart";
import { productCoreTheOne, variant } from "./product";

export const CHECKOUT_ID = "1";
export const PRODUCT_ID = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzE=";
export const VARIANT_ID = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8x";

const variantInfo: MockedResponse = {
  request: {
    query: VARIANT_INFO,
    variables: { ids: ["variant123"] },
  },
  result: {
    data: {
      variants: [
        {
          ...variant,
          id: "variant123",
          priceV2: {
            __typename: "MoneyV2",
            amount: "5.0",
            currencyCode: "USD",
          },
          product: {
            ...productCoreTheOne,
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1MzU1Mzc1MzMwMDY=",
            title: "Product-123",
          },
          sku: "variant123sku",
          subscriptionPriceAmount: {
            __typename: "Metafield",
            id: "spa",
            value: "4.0",
          },
          title: "Variant-123",
        },
      ],
    },
  },
};

export default {
  variantInfo,
};
