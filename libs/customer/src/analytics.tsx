import {
  dataLayerTrack,
  getCapturedTrackingParams,
  UserDataEvent,
} from "@sss/analytics";
import { useCart } from "@sss/ecommerce/cart";
import { FC, useEffect } from "react";

import { useCustomer } from "./context";
import { Customer } from "./types";

const trackUserDataEvent = (customer: Customer | null, cartTotal: string) => {
  // TODO: We do not have a cookie consent implementation
  const userConsent = "yes";

  const data: UserDataEvent = {
    cart_total: cartTotal,
    event: "dl_user_data",
    user_properties: customer
      ? {
          customer_email: customer.email,
          customer_first_name: customer.firstName,
          customer_id: customer.id.toString(),
          customer_last_name: customer.lastName,
          ...(customer.orders
            ? {
                customer_order_count: customer.orders?.toString(),
              }
            : undefined),
          customer_phone: customer.phone ?? undefined,
          customer_tags: customer.tags ?? "",
          ...(customer.spent
            ? {
                customer_total_spent: customer.spent,
              }
            : undefined),
          user_consent: userConsent,
          visitor_type: "logged_in",
        }
      : {
          user_consent: userConsent,
          visitor_type: "guest",
        },
    visitor_info: getCapturedTrackingParams(),
  };

  dataLayerTrack<UserDataEvent>(data);
};

export const TrackCustomerEvent: FC = () => {
  const { customer, loading } = useCustomer();
  const { lineItemsSubtotalPrice } = useCart();

  useEffect(() => {
    if (!loading) {
      trackUserDataEvent(customer, lineItemsSubtotalPrice.amount);
    }
  }, [customer, lineItemsSubtotalPrice, loading]);

  return null;
};
