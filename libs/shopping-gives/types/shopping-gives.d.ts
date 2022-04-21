export declare global {
  declare namespace SG {
    interface CartItem {
      discount: number;
      id: string;
      price: number;
      quantity: number;
    }

    interface Templater {
      targetElement?: HTMLElement;
    }

    interface WidgetController {
      templater: Templater;
    }
    interface CartController extends WidgetController {
      refreshCart: () => void;
    }
    interface ProductController extends WidgetController {
      setSubitem: (sku: string, price: number) => void;
    }
  }

  interface Window {
    cc_cart_items?: SG.CartItem[];
    sgCartControllers?: SG.CartController[];
    sgProductControllers?: SG.ProductController[];
  }
}
