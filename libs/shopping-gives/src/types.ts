// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/shopping-gives.d.ts" />

export type ShoppingGivesCartController = SG.CartController;
export type ShoppingGivesProductController = SG.ProductController;
export type ShoppingGivesWidgetController = SG.WidgetController;

export interface ShoppingGivesConfig {
  storeId?: string;
  testMode: boolean;
}
