import gql from "graphql-tag";
import { RequireAtLeastOne } from "type-fest";

import * as common from "./common";
import { Variant, variantFragment as variantFragment } from "./product";

export interface ShopifyAttributesInput {
  key: string;
  value: string;
}

export interface ShopifyCheckout {
  completedAt: string | null;
  id: string;
  lineItems: common.Connection<ShopifyCheckoutLineItem>;
  webUrl: string;
}

export type ShopifyCheckoutCreateInput = RequireAtLeastOne<{
  customAttributes: ShopifyAttributesInput[];
  email: string;
  lineItems: ShopifyCheckoutLineItemInput[];
}>;

export interface ShopifyCheckoutData {
  checkout: ShopifyCheckout | null;
}

export interface ShopifyCheckoutLineItem {
  id: string;
  quantity: number;
  title: string;
  variant: Variant;
}

export interface ShopifyCheckoutLineItemReplaceInput {
  checkoutId: string;
  lineItems: ShopifyCheckoutLineItemInput[];
}

export interface ShopifyCheckoutLineItemInput {
  quantity: number;
  variantId: string;
}

export interface ShopifyCheckoutUpdateData {
  payload: ShopifyCheckoutUpdatePayload;
}

export interface ShopifyCheckoutUpdatePayload {
  checkout: ShopifyCheckout | null;
  userErrors: common.UserError[];
}

const lineItem = gql`
  fragment sLineItem on CheckoutLineItem {
    id
    quantity
    title
    variant {
      ...variant
    }
  }
  ${variantFragment}
`;

const checkout = gql`
  fragment sCheckout on Checkout {
    completedAt
    id
    lineItems(first: 100) {
      edges {
        node {
          ...sLineItem
        }
      }
    }
    webUrl
  }
  ${lineItem}
`;

export const SHOPIFY_CHECKOUT = gql`
  query SHOPIFY_CHECKOUT($id: ID!) {
    # Note that we're querying 'node' and not 'sNode' as this query should
    # be made directly to Shopify and not proxied through our backend
    checkout: node(id: $id) {
      ...sCheckout
    }
  }
  ${checkout}
`;

export const SHOPIFY_CHECKOUT_CREATE = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    payload: checkoutCreate(input: $input) {
      checkout {
        ...sCheckout
      }
      # Alias checkoutUserErrors for consistency with other mutations
      userErrors: checkoutUserErrors {
        code
        field
        message
      }
    }
  }
  ${checkout}
`;

export const SHOPIFY_CHECKOUT_LINE_ITEM_REPLACE = gql`
  mutation checkoutLineItemsReplace(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutId: ID!
  ) {
    payload: checkoutLineItemsReplace(
      lineItems: $lineItems
      checkoutId: $checkoutId
    ) {
      checkout {
        ...sCheckout
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${checkout}
`;
