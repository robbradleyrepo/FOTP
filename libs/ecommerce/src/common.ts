import gql from "graphql-tag";

import { Address, addressFragment } from "./address";

export type Computed<T, C> = T & {
  computed: C;
};

export interface Connection<T> {
  edges: Edge<T>[];
}

export interface CoreLineItemCollection {
  billingAddress: Address | null;
  itemCount: number;
  lineItemsSubtotalPrice: Money;
  shippingAddress: Address | null;
  totalDiscounts: Money;
  totalPrice: Money;
  totalShipping: Money;
  totalTax: Money;
}

export interface CoreLineItem {
  frequency: Frequency | null;
  image: string;
  linePrice: Money;
  price: Money;
  productId: string;
  properties: Property[];
  quantity: number;
  sku: string;
  title: string;
  variantId: string;
  variantTitle: string | null;
}

export interface DateRange {
  max: string;
  min: string;
}

export interface Discount {
  percentage: number;
  price: Money;
}

export interface Edge<T> {
  node: T;
}

export interface Frequency {
  chargeDelayDays: number | null;
  orderIntervalFrequency: number;
  orderIntervalUnit: OrderIntervalUnit;
}

export interface Metafield<T = string> {
  id: string;
  value: T;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export type OrderIntervalUnit = "DAY" | "WEEK" | "MONTH";

export interface Property {
  name: string;
  value: string;
}

export interface UserError {
  code: string;
  field: string[] | null;
  message: string;
}

export interface CustomerUserError extends UserError {
  code:
    | "UNIDENTIFIED_CUSTOMER"
    | "BLANK"
    | "CONTAINS_HTML_TAGS"
    | "CONTAINS_URL"
    | "CUSTOMER_DISABLED"
    | "INVALID"
    | "NOT_FOUND"
    | "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE"
    | "TAKEN"
    | "TOKEN_INVALID"
    | "TOO_LONG"
    | "TOO_SHORT"
    | "ALREADY_ENABLED";
}

export const dateRangeFragment = gql`
  fragment dateRange on DateRange {
    max
    min
  }
`;

export const frequencyFragment = gql`
  fragment frequency on RFrequency {
    chargeDelayDays
    orderIntervalFrequency
    orderIntervalUnit
  }
`;

export const moneyFragment = gql`
  fragment money on MoneyV2 {
    amount
    currencyCode
  }
`;

export const propertiesFragment = gql`
  fragment properties on RProperties {
    name
    value
  }
`;

export const coreLineItemFragment = gql`
  fragment coreLineItem on RCoreLineItem {
    frequency {
      ...frequency
    }
    image
    linePrice {
      ...money
    }
    price {
      ...money
    }
    productId
    properties {
      ...properties
    }
    quantity
    sku
    title
    variantId
    variantTitle
  }
  ${frequencyFragment}
  ${moneyFragment}
  ${propertiesFragment}
`;

export const coreLineItemCollectionFragment = gql`
  fragment coreLineItemCollection on RCoreLineItemCollection {
    billingAddress {
      ...address
    }
    itemCount
    shippingAddress {
      ...address
    }
    lineItemsSubtotalPrice {
      ...money
    }
    totalDiscounts {
      ...money
    }
    totalPrice {
      ...money
    }
    totalShipping {
      ...money
    }
    totalTax {
      ...money
    }
  }
  ${addressFragment}
  ${moneyFragment}
`;

export const getLegacyId = (gid: string) => {
  const str =
    typeof window !== "undefined"
      ? atob(gid)
      : Buffer.from(gid, "base64").toString("binary");

  // Cast to `string` as `str.split` will always return at least one item
  return str.split("/").pop() as string;
};

export const getOrderIntervalUnit = (unit: string) => {
  const normalized = unit.toUpperCase().replace(/S$/, "");

  if (!/^(DAY|WEEK|MONTH)$/.test(normalized)) {
    throw new Error(`Invalid order interval unit "${unit}"`);
  }

  return normalized as OrderIntervalUnit;
};

export const parseFloatMetafield = (
  metafield: Metafield | null
): number | null => {
  if (!metafield) {
    return null;
  }

  const value = parseFloat(metafield.value);

  return isNaN(value) ? null : value;
};

export const parseIntegerMetafield = (
  metafield: Metafield | null
): number | null => {
  if (!metafield) {
    return null;
  }

  const value = parseInt(metafield.value);

  return isNaN(value) ? null : value;
};

const toFloat = ({ amount }: Money) => Number(amount);
const update = (money: Money, amount: number): Money => ({
  ...money,
  amount: `${amount}`,
});

const add = (augend: Money, addend: Money): Money => {
  // Sanity check: make sure we're adding the same currency
  if (augend.currencyCode !== addend.currencyCode) {
    throw new Error("Cannot add different currencies");
  }

  return update(augend, toFloat(augend) + toFloat(addend));
};
const multiply = (money: Money, multplier: number): Money =>
  update(money, toFloat(money) * multplier);

const divide = (dividend: Money, divisor: number): Money =>
  multiply(dividend, 1 / divisor);
const subtract = (minuend: Money, subtrahend: Money): Money =>
  add(minuend, multiply(subtrahend, -1));

export const moneyFns = {
  add,
  divide,
  multiply,
  subtract,
  toFloat,
  update,
};

export const getDiscount = (
  price: Money,
  comparisonPrice: Money
): Discount | null => {
  const priceAmount = toFloat(price);
  const comparisonPriceAmount = toFloat(comparisonPrice);

  return comparisonPriceAmount > priceAmount
    ? {
        percentage: (1 - toFloat(price) / toFloat(comparisonPrice)) * 100,
        price: subtract(comparisonPrice, price),
      }
    : null;
};
