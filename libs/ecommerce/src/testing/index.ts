import { default as cart } from "./queries/cart";
import { default as checkout } from "./queries/checkout";
import { default as checkoutUpdate } from "./queries/checkout-update";
import { default as collection } from "./queries/collection";
import { default as product } from "./queries/product";

export { CHECKOUT_ID, PRODUCT_ID, VARIANT_ID } from "./queries/checkout";

export const mockedResponses = {
  cart,
  checkout,
  checkoutUpdate,
  collection,
  product,
};
