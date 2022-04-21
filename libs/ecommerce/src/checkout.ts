import {
  Order,
  orderFragment,
  Transaction,
  transactionFragment,
} from "@sss/ecommerce/order";
import {
  ProductCore,
  productCoreFragment,
  Variant,
  variantFragment,
} from "@sss/ecommerce/product";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { RequireAtLeastOne } from "type-fest";

import { AddressInput, PartialAddressInput } from "./address";
import type { EnhancedCartLineItem } from "./cart";
import * as common from "./common";
import {
  coreLineItemCollectionFragment,
  coreLineItemFragment,
  moneyFragment,
  propertiesFragment,
} from "./common";

export interface Checkout extends common.CoreLineItemCollection {
  acceptsEmailMarketing: boolean;
  availableShippingRates: {
    ready: boolean;
    shippingRates: ShippingRate[] | null;
  };
  customer: {
    analyticsUserId: string;
    id: string;
  } | null;
  completedAt: string | null;
  discount: {
    amount: common.Money;
    applicable: boolean;
    code: string;
    reason: DiscountReasonCode;
    type: DiscountType;
    value: number;
  } | null;
  email: string | null;
  id: string;
  lineItems: LineItem[];
  noteAttributes: common.Property[] | null;
  rOrders: Order[] | null;
  ready: boolean;
  shippingRate: ShippingRate | null;
  taxesIncluded: boolean;
  taxLines: TaxLine[] | null;
  transaction: Transaction | null;
  webUrl: string;
}

export interface CheckoutData {
  rCheckout: Checkout | null;
}

export interface CheckoutWithVariants extends Checkout {
  lineItems: LineItemWithVariant[];
}

export interface CheckoutWithVariantsData {
  rCheckout: CheckoutWithVariants | null;
}

export interface CheckoutChargeInput {
  authorizationToken?: string;
  token: string;
}

export enum DiscountReasonCode {
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
  NOT_APPLICABLE = "NOT_APPLICABLE",
  ONCE_PER_EMAIL = "ONCE_PER_EMAIL",
  REQUIRES_EMAIL = "REQUIRES_EMAIL",
  SPEND_THRESHOLD_MAX = "SPEND_THRESHOLD_MAX",
  SPEND_THRESHOLD_MIN = "SPEND_THRESHOLD_MIN",
}

export enum DiscountType {
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE = "PERCENTAGE",
  SHIPPING = "SHIPPING",
}

export interface LineItem extends common.CoreLineItem {
  id: string;
  productType: string;
  vendor: string;
}

export enum LineItemType {
  CONTAINER = "container",
}

export interface LineItemWithVariant extends LineItem {
  product: ProductCore;
  variant: Variant;
}

export type CheckoutBillingAddressInput = { address: AddressInput };
export type CheckoutDiscountInput = { code: string | null };
export type CheckoutEmailInput = {
  acceptsEmailMarketing?: boolean;
  email?: string;
};
export type CheckoutLineItemInput = Pick<
  LineItem,
  "productId" | "properties" | "quantity" | "variantId"
> & {
  frequency: common.Frequency | null;
};
export type CheckoutPhoneInput = { phone: string | null };
export type CheckoutShippingAddressInput =
  | {
      address: AddressInput;
      partial?: false;
    }
  | {
      address: PartialAddressInput;
      partial: true;
    };
export type CheckoutShippingRateInput = { handle: string };

export type CheckoutNoteInput = { note: string };

export type NoteAttributesInput = common.Property[];

export type CheckoutUpdateInput = RequireAtLeastOne<{
  billingAddress: CheckoutBillingAddressInput;
  discount: CheckoutDiscountInput;
  email: CheckoutEmailInput;
  lineItems: CheckoutLineItemInput[];
  phone: CheckoutPhoneInput;
  shippingAddress: CheckoutShippingAddressInput;
  shippingRate: CheckoutShippingRateInput;
  note: CheckoutNoteInput;
  noteAttributes: NoteAttributesInput;
}>;

export interface CheckoutUpdatePayload {
  rCheckout: Checkout | null;
  userErrors: common.UserError[];
}

export interface CheckoutUpdateData {
  payload: CheckoutUpdatePayload;
}

interface CheckoutChargePayload extends CheckoutUpdatePayload {
  authorizationToken: string | null;
}

export interface CheckoutChargeData {
  payload: CheckoutChargePayload;
}

export interface ShippingRate {
  handle: string;
  price: common.Money;
  title: string;
}

export interface TaxLine {
  price: common.Money;
  rate: number;
  title: string;
}

const checkoutLineItemFragment = gql`
  fragment checkoutLineItem on RLineItem {
    ...coreLineItem

    id
    productType
    vendor
  }
`;

const shippingRateFragment = gql`
  fragment shippingRate on RShippingRate {
    handle
    price {
      ...money
    }
    title
  }
`;

const checkoutFragment = gql`
  fragment checkout on RCheckout {
    ...coreLineItemCollection
    acceptsEmailMarketing
    availableShippingRates {
      ready
      shippingRates {
        ...shippingRate
      }
    }
    customer {
      analyticsUserId
      id
    }
    completedAt
    discount {
      amount {
        ...money
      }
      applicable
      code
      reason
      type
      value
    }
    email
    id
    lineItems {
      ...checkoutLineItem
    }
    noteAttributes {
      ...properties
    }
    rOrders {
      ...order
    }
    ready
    shippingRate {
      ...shippingRate
    }
    taxesIncluded
    taxLines {
      price {
        ...money
      }
      rate
      title
    }
    transaction {
      ...transaction
    }
    webUrl
  }

  ${checkoutLineItemFragment}
  ${shippingRateFragment}
  ${coreLineItemCollectionFragment}
  ${coreLineItemFragment}
  ${moneyFragment}
  ${propertiesFragment}
  ${orderFragment}
  ${transactionFragment}
`;

export const CHECKOUT = gql`
  query CHECKOUT($id: ID) {
    rCheckout(id: $id) {
      ...checkout
    }
  }
  ${checkoutFragment}
`;

export const CHECKOUT_CHARGE = gql`
  mutation CHECKOUT_CHARGE($token: String!, $authorizationToken: String) {
    payload: rCheckoutCharge(
      input: {
        authorizationToken: $authorizationToken
        processor: STRIPE
        token: $token
        type: CREDIT_CARD
      }
    ) {
      authorizationToken
      rCheckout {
        ...checkout
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${checkoutFragment}
`;

export const CHECKOUT_COMPLETED = gql`
  query CHECKOUT_COMPLETED($id: ID!) {
    rCheckout: rCheckoutCompleted(id: $id) {
      ...checkout
    }
  }
  ${checkoutFragment}
`;

export const CHECKOUT_COMPLETED_CORE = gql`
  query CHECKOUT_COMPLETED_CORE($id: ID!) {
    rCheckout: rCheckoutCompleted(id: $id) {
      id
      completedAt
    }
  }
`;

export const CHECKOUT_UPDATE = gql`
  mutation CHECKOUT_UPDATE(
    $billingAddress: RCheckoutBillingAddressInput
    $discount: RCheckoutDiscountInput
    $email: RCheckoutEmailInput
    $lineItems: [RCheckoutLineItemInput!]
    $phone: RCheckoutPhoneInput
    $shippingAddress: RCheckoutShippingAddressInput
    $shippingRate: RCheckoutShippingRateInput
    $note: RCheckoutNoteInput
    $noteAttributes: [RPropertyInput!]
  ) {
    payload: rCheckoutUpdate(
      input: {
        billingAddress: $billingAddress
        discount: $discount
        email: $email
        lineItems: $lineItems
        phone: $phone
        shippingAddress: $shippingAddress
        shippingRate: $shippingRate
        note: $note
        noteAttributes: $noteAttributes
      }
    ) {
      userErrors {
        code
        message
        field
      }
      rCheckout {
        ...checkout
      }
    }
  }
  ${checkoutFragment}
`;

export const CHECKOUT_WITH_VARIANTS = gql`
  query CHECKOUT($id: ID) {
    rCheckout(id: $id) {
      ...checkout
      lineItems {
        ...checkoutLineItem
        product {
          ...productCore
        }
        variant {
          ...variant
        }
      }
    }
  }
  ${checkoutFragment}
  ${checkoutLineItemFragment}
  ${productCoreFragment}
  ${variantFragment}
`;

export const cartLineitemsToCheckoutInput = (
  cartLineItems: EnhancedCartLineItem[]
): CheckoutLineItemInput[] => {
  const checkoutLineItemInputs: CheckoutLineItemInput[] = [];

  for (const cartLineItem of cartLineItems) {
    checkoutLineItemInputs.push({
      frequency: cartLineItem.frequency,
      productId: cartLineItem.variant.product.id,
      properties: [{ name: "cartLineItemId", value: cartLineItem.id }],
      quantity: cartLineItem.quantity,
      variantId: cartLineItem.variant.id,
    });

    if (cartLineItem.container) {
      checkoutLineItemInputs.push({
        frequency: null, // Containers are never subscription items
        productId: cartLineItem.container.productId,
        properties: [
          { name: "cartLineItemId", value: cartLineItem.id },
          { name: "lineItemType", value: LineItemType.CONTAINER },
        ],
        quantity: 1, // We'll only ever have one container per line item
        variantId: cartLineItem.container.variantId,
      });
    }
  }

  return checkoutLineItemInputs;
};

export const getDefaultShippingRate = (
  rates: ShippingRate[]
): ShippingRate | null =>
  rates.sort(
    (a, b) =>
      common.moneyFns.toFloat(a.price) - common.moneyFns.toFloat(b.price)
  )[0] ?? null;

export const getUpdatedNoteAttributes = (
  checkout: Checkout,
  noteAttributes: Record<string, string>
): common.Property[] =>
  Object.entries({
    ...(checkout.noteAttributes ?? []).reduce(
      (accum, { name, value }) => ({ ...accum, [name]: value }),
      {} as Record<string, string>
    ),
    ...noteAttributes,
  }).map(([name, value]) => ({
    name,
    value,
  }));

export const useRedirectToWebCheckout = () => {
  const router = useRouter();

  return (replace = false) =>
    router[replace ? "replace" : "push"]({
      pathname: "/checkout/[step]",
      query: { step: "information" },
    });
};
