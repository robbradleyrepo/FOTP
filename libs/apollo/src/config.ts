export const BACKEND_URL = process.env.BACKEND_URL;

// See: https://help.shopify.com/en/api/versioning
// This should match the version used in `fotp-backend` so that the response
// from the `shopifyLink` matches that from the `backendLink`
export const SHOPIFY_GRAPHQL_VERSION = "2022-01";

export const STOREFRONT_API = {
  accessToken: process.env.SHOPIFY_US_ACCESS_TOKEN,
  domain: process.env.SHOPIFY_US_PRIMARY_DOMAIN,
};
