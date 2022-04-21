declare namespace NodeJS {
  export interface ProcessEnv {
    BACKEND_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    DEFAULT_DISCOUNT_CODE?: string;
    DISABLED_DISCOUNT_CODES?: string;
    ENVIRONMENT: "development" | "prod" | "staging" | "test";
    FB_APP_ID: string;
    FB_HANDLE: string;
    FEATURE_SHOPIFY_CHECKOUT?: string;
    GOOGLE_OPTIMIZE_KEY?: string;
    GOOGLE_TAG_MANAGER?: string;
    GOOGLE_TAG_MANAGER_PROXY_URL?: string;
    GORGIAS_CHAT_APP_ID?: string;
    INSTAGRAM_HANDLE: string;
    MAPBOX_KEY: string;
    MAPBOX_STYLE_ID: string;
    MAPBOX_USERNAME: string;
    ORIGIN: string;
    PRISMIC_BASE_URL: string;
    PURPLE_DOT_API_KEY: string;
    SENTRY_DSN?: string;
    SHOPIFY_US_ACCESS_TOKEN: string;
    SHOPIFY_US_PRIMARY_DOMAIN: string;
    SHOPPING_GIVES_STORE_ID?: string;
    SHOPPING_GIVES_TEST_MODE?: string;
    STAMPED_API_KEY?: string;
    STAMPED_STORE_URL?: string;
    STRIPE_PUBLISHABLE_KEY: string;
    TWITTER_HANDLE: string;
    VIDALYTICS_CUSTOMER_ID: string;
    VIMEO_ACCESS_TOKEN: string;
  }
}
