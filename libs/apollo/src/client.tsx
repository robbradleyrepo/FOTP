import { captureDetailedException } from "@sss/sentry";
import { ApolloLink, HttpLink } from "apollo-boost";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCacheObject,
} from "apollo-cache-inmemory";
import { ApolloClient, ApolloError } from "apollo-client";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import merge from "deepmerge";
import unfetch from "isomorphic-unfetch";
import { useMemo } from "react";

import introspectionQueryResultData from "../../../generated/config/fragment-types.json";
import { BACKEND_URL, SHOPIFY_GRAPHQL_VERSION, STOREFRONT_API } from "./config";
import { dataIdFromObject, stringifyApolloError } from "./helpers";
import { ApolloClientType } from "./types";

/**
 * Don't export `apolloClient` as we never want to reuse it on the server.
 * Instead, we'll expose `getApolloClient`, which will set and/or reuse
 * `apolloClient` on the client, but always return a new Apollo client on the
 * server.
 */
let cachedApolloClient: ApolloClientType | null = null;

function createApolloClient({
  previewToken,
}: {
  previewToken?: string;
}): ApolloClientType {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });
  const cache = new InMemoryCache({
    dataIdFromObject,
    fragmentMatcher,
  });
  const ssrMode = typeof window === "undefined";

  const fetch: WindowOrWorkerGlobalScope["fetch"] = unfetch;

  const serverNetworkErrorLink = onError(
    ({ graphQLErrors, networkError, operation, response }) => {
      if (typeof window !== "undefined") {
        // We're on the client.
        // We leave error handling to the call sites.
        return;
      }

      if (networkError) {
        const error = new ApolloError({
          extraInfo: {
            operationName: operation.operationName,
            response,
          },
          graphQLErrors,
          networkError,
        });
        captureDetailedException(error, {
          apolloError: stringifyApolloError(error),
        });
      }
    }
  );

  const shopifyLink = new ApolloLink((operation, forward) => {
    const shopify = operation.getContext().shopify;
    const query: Record<string, string> =
      typeof shopify === "object" ? shopify?.query ?? {} : {};

    const uri = new URL(
      `https://${STOREFRONT_API.domain}/api/${SHOPIFY_GRAPHQL_VERSION}/graphql.json`
    );

    for (const [key, value] of Object.entries(query)) {
      uri.searchParams.set(key, value);
    }

    operation.setContext({
      uri: uri.toString(),
    });
    return forward(operation);
  }).concat(
    new HttpLink({
      fetch: unfetch,
      headers: {
        "X-Shopify-Storefront-Access-Token": STOREFRONT_API.accessToken,
      },
    })
  );

  // We're using a separate POST based link for preview requests to avoid
  // the peristed query link network cache layer
  const previewBackendLink = setContext((_operation, { headers }) => ({
    headers: {
      ...headers,
      "X-FOTP-PRISMIC-PREVIEW-TOKEN": previewToken,
    },
  }));
  const persistedBackendLink = createPersistedQueryLink({
    useGETForHashedQueries: true,
  });
  const backendLink = new HttpLink({
    credentials: "include",
    fetch,
    uri: `${BACKEND_URL}/us/en/graphql`,
  });

  return new ApolloClient<NormalizedCacheObject>({
    cache,
    link: serverNetworkErrorLink.concat(
      HttpLink.split(
        (operation) => !!operation.getContext().shopify,
        shopifyLink,
        HttpLink.split(
          () => !!previewToken,
          previewBackendLink.concat(backendLink),
          persistedBackendLink.concat(backendLink)
        )
      )
    ),
    ssrMode,
  });
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */

export const initializeApollo = ({
  initialState,
  previewToken,
}: {
  initialState?: NormalizedCacheObject;
  previewToken?: string;
}): ApolloClientType => {
  let apolloClient: ApolloClientType;
  if (typeof window === "undefined") {
    // Server
    if (cachedApolloClient !== null) {
      // Sanity check
      throw new Error("`cachedApolloClient` must be `null` on the server.");
    }

    apolloClient = createApolloClient({ previewToken });
  } else {
    // Client
    if (cachedApolloClient !== null) {
      apolloClient = cachedApolloClient;
    } else {
      apolloClient = createApolloClient({ previewToken });
      cachedApolloClient = apolloClient;
    }
  }

  if (initialState) {
    apolloClient.cache.restore(
      merge(initialState, apolloClient.extract(), {
        // Be conservative for arrays and simply overwrite rather
        // than trying to combine items.
        arrayMerge: (_destArray, sourceArray) => sourceArray,
      })
    );
  }

  return apolloClient;
};

export const useApollo = (opts: {
  initialState?: NormalizedCacheObject;
  previewToken?: string;
}) => useMemo(() => initializeApollo(opts), [opts.initialState]);
