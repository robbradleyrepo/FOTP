import { ShoppingGivesConfig } from "./types";

const SHOPPING_GIVES: ShoppingGivesConfig = {
  storeId: process.env.SHOPPING_GIVES_STORE_ID,
  testMode: process.env.SHOPPING_GIVES_TEST_MODE?.toLowerCase() === "true",
};

export default SHOPPING_GIVES;
