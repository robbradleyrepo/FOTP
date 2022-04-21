export declare global {
  interface Window {
    GORGIAS_API_BASE_URL?: string;
    GORGIAS_CHAT_APP?: Record<string, unknown>;
    GORGIAS_CHAT_APP_ID?: string;
    GORGIAS_CHAT_BASE_URL?: string;
    GORGIAS_CHAT_BUNDLE_VERSION?: string;
    GORGIAS_CHAT_CUSTOMER_EMAIL?: string;
    GORGIAS_CHAT_CUSTOMER_NAME?: string;
    GORGIAS_CHAT_TEXTS?: Record<string, string>;
    HIDE_POWERED_BY_GORGIAS?: boolean;
    // Note that we can't use the chat's built-in Shopify integration as it
    // requires Shopify theme engine variables and endpoints
    IS_SHOPIFY?: never;
    SHOPIFY_CUSTOMER_EMAIL?: never;
    SHOPIFY_CUSTOMER_ID?: never;
    SHOPIFY_PERMANENT_DOMAIN?: never;
  }
}
