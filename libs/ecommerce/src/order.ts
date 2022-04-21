import gql from "graphql-tag";

import * as address from "./address";
import * as common from "./common";
import { coreLineItemFragment, moneyFragment } from "./common";
import {
  PaymentCard,
  paymentCardFragment,
  PaymentProcessor,
} from "./payment-source";

export interface Order extends OrderCore {
  billingAddress: address.Address;
  lineItems: OrderLineItem[];
  lineItemsSubtotalPrice: common.Money;
  shippingAddress: address.Address;
  subtotalPrice: common.Money;
  totalDiscounts: common.Money;
  totalRefunds: common.Money;
  totalShipping: common.Money;
  totalTax: common.Money;
}

export interface OrderCore {
  createdAt: string;
  id: string;
  itemCount: number;
  orderId: string;
  orderNumber: number;
  totalPrice: common.Money;
}

export type OrderData = Record<"rOrder", Order>;

export type OrderLineItem = common.CoreLineItem;

export type OrdersCoreData = Record<"rOrders", common.Connection<OrderCore>>;

export interface Transaction {
  card: PaymentCard | null;
  isFree: boolean | null;
  processor: PaymentProcessor;
  processedAt: Date;
  transactionId: string | null;
}

export const transactionFragment = gql`
  fragment transaction on RTransaction {
    card {
      ...paymentCard
    }
    isFree
    processor
    processedAt
    transactionId
  }
  ${paymentCardFragment}
`;

export const orderFragment = gql`
  fragment order on ROrder {
    createdAt
    id
    itemCount
    orderId
    orderNumber
    totalPrice {
      ...money
    }
    billingAddress {
      ...address
    }
    lineItems {
      ...coreLineItem
    }
    lineItemsSubtotalPrice {
      ...money
    }
    shippingAddress {
      ...address
    }
    subtotalPrice {
      ...money
    }
    totalDiscounts {
      ...money
    }
    totalRefunds {
      ...money
    }
    totalShipping {
      ...money
    }
    totalTax {
      ...money
    }
    transaction {
      ...transaction
    }
  }
  ${transactionFragment}
  ${coreLineItemFragment}
  ${moneyFragment}
  ${address.addressFragment}
`;
