import { addBreadcrumb } from "@sentry/nextjs";
import { v4 as uuid } from "uuid";

export interface Product {
  // XXX: From looking at the Elevar datalayer spec, there's not really a neat
  //      abstraction for the different uses of product / impression / line item
  //      I have opted for a single type with optional fields for now.

  // Standard

  /**
   * Shopify Product vendor.
   */
  brand: string;

  /**
   * Shopify product type.
   */
  category: string;

  /**
   * Shopify compareAtPrice.
   */
  compare_at_price?: string;

  /**
   * Variant SKU, or empty if no SKU is available.
   */
  id: string;

  /**
   * Featured image
   */
  image?: string;

  /**
   * The current inventory count for this product (if available)
   */
  inventory?: string;

  /**
   * The Shopify collection this product belongs to.
   *
   * As pathname for the collection or as a name e.g. "Search Results", "Shopping Cart"
   */
  list?: string;

  /**
   * Shopify product name
   */
  name: string;

  /**
   * The position this product appears in a list.
   */
  position?: number;

  /**
   * The lowest price of all the product's variants
   */
  price: string;

  /**
   * The Shopify Product ID (not the GraphQL ID!)
   */
  product_id: string;

  /**
   * The number of items
   *
   * When used as a cart
   */
  quantity?: number;

  /**
   * The Shopify Variant title, " / " separated.
   */
  variant: string;

  /**
   * The Shopify Variant ID (not the GraphQL ID!)
   */
  variant_id: string;

  // Extension

  /**
   * The Shopify product handle (what's in the URL)
   */
  handle?: string;

  /**
   * Barcode (ISBN, UPC, GTIN, etc.)
   */
  gtin?: string;

  /**
   * The subscription frequency
   */
  interval_frequency?: number;

  /**
   * The subscription frequency
   */
  interval_unit?: "DAY" | "MONTH" | "WEEK";

  /**
   * Whether an item is a pre-order or not
   */
  is_preorder?: boolean;

  /**
   * The primary product page URL.
   */
  product_url?: string;

  /**
   * Whether a one time or subscription item.
   */
  purchase_type?: "one time" | "subscribe";
}

export interface Purchase {
  // Standard

  /**
   * The store name
   */
  affiliation: string;

  /**
   * Any discount code used
   *
   * When multiple discount codes are used, just send the highest value / first.
   */
  coupon?: string;

  /**
   * The total discount on this order
   */
  discount_amount: string;

  /**
   * The Shopify Order ID (e.g. 1001)
   */
  id: string;

  /**
   * The Order revenue (including taxes)
   */
  revenue: string;

  /**
   * The total tax paid
   */
  tax: string;

  // Extension

  /**
   * The total shipping paid
   */
  shipping: string;

  /**
   * The Order subtotal
   *
   * The subtotal doesn’t include taxes (unless taxes are included in the prices) or shipping costs.
   */
  sub_total: string;

  /**
   * The Shopify order name e.g. #1001.
   */
  order_name: string;

  /**
   * Whether a one time or subscription item.
   */
  purchase_type?: "one time" | "subscribe";
}

export interface Event {
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Visitor {
  visitor_type: "guest" | "logged_in";

  // XXX: We're diverging from the Elevar datalayer spec here, as we may have
  //      some additional visitor data but not all the required `Customer`
  //      fields

  customer_email?: string;

  customer_order_count?: string;

  customer_tags?: string;

  customer_total_spent?: string;

  customer_phone?: string;

  customer_first_name?: string;

  customer_last_name?: string;

  customer_city?: string;

  customer_province_code?: string;

  customer_zip?: string;

  customer_country_code?: string;

  /**
   * Whether the user has opted in to cookie consent or not
   */
  user_consent: "no" | "no_interaction" | "yes";
}

export interface Guest extends Visitor {
  visitor_type: "guest";
}

export interface Customer extends Visitor {
  customer_email: string;

  customer_id: string;

  customer_tags: string;

  visitor_type: "logged_in";
}

export type PageEvent = Event;

/**
 * Whenever we load a page to populate the datalayer with customer data.
 */
export interface UserDataEvent extends Event {
  cart_total: string;
  event: "dl_user_data";
  user_properties: Guest | Customer;
  // Extension
  visitor_info: Record<string, string>;
}

/**
 * Collection page product impressions
 *
 * Elever uses localStorage for this to carry the category page that user added to cart
 * from across the website.
 */
export interface ViewItemListEvent extends Event {
  ecommerce: {
    currencyCode: "USD";
    /**
     * Visible products in the item list
     */
    impressions: Product[];
  };
  event: "dl_view_item_list";
}

/**
 * Collection/Search page product click.
 *
 * E.g. This is the product the user clicks on from collection page.
 */
export interface SelectItemEvent extends Event {
  ecommerce: {
    click: {
      actionField: {
        /**
         * The collection page URL.
         */
        list: string;
        products: Product[];
      };
    };
    currencyCode: "USD";
  };
  event: "dl_select_item";
}

export interface ViewItemEvent extends Event {
  // Standard
  ecommerce: {
    currencyCode: "USD";
    detail: {
      // XXX: In the Elevar dump but not in the GA4 spec. Possibly redundant.
      // actionField: {
      //   /**
      //    * The collection page URL.
      //    */
      //   list: string;
      // };
      products: Product[];
    };
  };
  event: "dl_view_item";

  // Extension

  /**
   * Where on the site this product was viewed.
   */
  source: string;
}

export interface AddToCartEvent extends Event {
  // Standard
  ecommerce: {
    currencyCode: "USD";
    add: {
      // XXX: In the Elevar dump but not in the GA4 spec. Possibly redundant.
      // actionField: {
      //   /**
      //    * The collection page URL.
      //    */
      //   list: string;
      // };
      products: Product[];
    };
  };
  event: "dl_add_to_cart";

  // Extension

  /**
   * Where on the site this product was viewed.
   */
  source: string;
}

export interface RemoveFromCartEvent extends Event {
  ecommerce: {
    currencyCode: "USD";
    remove: {
      // XXX: In the Elevar dump but not in the GA4 spec. Possibly redundant.
      // actionField: {
      //   /**
      //    * The collection page URL.
      //    */
      //   list: string;
      // };
      products: Product[];
    };
  };
  event: "dl_remove_from_cart";
}

export interface ViewCartEvent extends Event {
  // Standard

  cart_total: string;
  ecommerce: {
    actionField: {
      list: "Shopping Cart";
    };
    currencyCode: "USD";
    impressions: Product[];
  };
  event: "dl_view_cart";

  // Extension

  cart_id?: string;

  /**
   * Whether any item is a pre-order or not
   */
  is_preorder: boolean;

  /**
   * Whether any item is a subscription or all one time.
   */
  purchase_type: "one time" | "subscribe";
}

export interface CheckoutStepEvent extends Event {
  // Standard
  ecommerce: {
    checkout: {
      actionField: {
        step: "1" | "2" | "3";
      };
      products: Product[];
    };
    currencyCode: "USD";
  };
  event: "dl_begin_checkout" | "dl_add_payment_info" | "dl_add_shipping_info";

  // Extension
  cart_id?: string;

  cart_total: string;

  /**
   * Whether any item is a pre-order or not
   */
  is_preorder?: boolean;

  /**
   * Whether any item is a subscription or all one time.
   */
  purchase_type: "one time" | "subscribe";
}

export interface PrePurchaseEvent extends Event {
  ecommerce: {
    currencyCode: "USD";
    purchase: {
      actionField: Purchase;
      products: Product[];
    };
  };
  event: "dl_pre_purchase";

  purchase_type: "one time";

  user_properties: Guest | Customer;
}

export interface PurchaseEvent extends Event {
  ecommerce: {
    currencyCode: "USD";
    purchase: {
      actionField: Purchase;
      products: Product[];
    };
  };
  event: "dl_purchase";

  /**
   * Whether any item is a pre-order or not
   */
  // We do not have pre-order in this context.
  // is_preorder: boolean;

  /**
   * Whether any item is a subscription or all one time.
   */
  purchase_type: "one time" | "subscribe";

  user_properties: Guest | Customer;
}

export interface SubscribeEvent extends Event {
  email: string;

  /* The klaviyo list */
  list?: string;

  /**
   * Where on the site the subscription happened.
   */
  source?: string;
}

export const dataLayerTrack = <TEvent extends Event>(data: TEvent): void => {
  const eventId = uuid();
  dataLayerPush({ event_id: eventId, ...data });

  // We push all analytics events to Sentry for tracing.
  const { event, ...rest } = data;
  addBreadcrumb({
    data: rest,
    event_id: eventId,
    message: event,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataLayerPush = <T extends Record<string, any>>(data: T): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)?.dataLayer?.push(data);
};
