import type { NormalizedCacheObject } from "apollo-cache-inmemory";
import type { ApolloClient } from "apollo-client";
import type { NextComponentType, NextPageContext } from "next";

export type ApolloClientType = ApolloClient<NormalizedCacheObject>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithApollo<P = {}, IP = P> = NextComponentType<
  NextPageWithApolloContext,
  IP,
  P
>;

export interface NextPageWithApolloContext extends NextPageContext {
  apolloClient: ApolloClientType;
}
