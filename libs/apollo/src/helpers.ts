import { defaultDataIdFromObject, IdGetterObj } from "apollo-cache-inmemory";
import {
  ApolloQueryResult,
  OperationVariables,
  QueryOptions,
} from "apollo-client";
import { ApolloError, isApolloError } from "apollo-client";
import type { FetchResult } from "apollo-link";
import { DocumentNode, GraphQLError } from "graphql";
import { ExecutionResult } from "react-apollo";

import { ApolloClientType } from "./types";

export { isApolloError };

export const dataIdFromObject = (
  obj: IdGetterObj & { [k: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  let dataId = defaultDataIdFromObject(obj);

  const { __typename, _meta } = obj;

  if (dataId === null && __typename) {
    // Get the ID from Prismic's `_meta` object, if available
    const ident = _meta?.id;

    if (ident) {
      dataId = `${__typename}:${ident}`;
    }
  }

  // If we're using a completed checkout, we'll add a suffix to ensure that
  // it's updated independently to the incomplete one
  if (__typename === "RCheckout" && obj.completedAt) {
    dataId += ":completed";
  }

  return dataId;
};

// TODO: improve types so `__typename` is explicitly excluded
export const sanitize = <T>(arg: T): T => {
  if (Array.isArray(arg)) {
    return (arg.map(sanitize) as unknown) as T;
  } else if (Object.prototype.toString.call(arg) === "[object Object]") {
    return (Object.entries(arg)
      .filter(([key]) => key !== "__typename")
      .reduce(
        (accum, [key, value]) => ({ ...accum, [key]: sanitize(value) }),
        {}
      ) as unknown) as T;
  }

  return arg;
};

const stringifyError = <T extends Error, K extends keyof T>(error: T) =>
  JSON.stringify(
    Object.getOwnPropertyNames(error).reduce(
      (accum, key) => ({ ...accum, [key]: JSON.stringify(error[key as K]) }),
      {}
    )
  );

export const stringifyApolloError = (error: ApolloError) =>
  stringifyError({
    ...error,
    graphQLErrors: error.graphQLErrors.map(stringifyError),
    networkError: error.networkError && stringifyError(error.networkError),
  });

export const throwGraphQLErrors = (
  results:
    | ApolloQueryResult<unknown>
    | ApolloQueryResult<unknown>[]
    | ExecutionResult<unknown>
    | ExecutionResult<unknown>[]
    | FetchResult<unknown>
    | FetchResult<unknown>[],
  errorMessage = "Unexpected GraphQLErrors"
) => {
  const allResults = Array.isArray(results) ? results : [results];
  const graphQLErrors: GraphQLError[] = allResults.reduce(
    (accum, { errors = [] }) => [...accum, ...errors],
    [] as GraphQLError[]
  );

  if (graphQLErrors.length > 0) {
    throw new ApolloError({
      errorMessage,
      extraInfo: {
        data: allResults.map(({ data }) => data),
      },
      graphQLErrors,
    });
  }
};

export const runServerSideQuery = async <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T = Record<string, any>,
  TVariables = OperationVariables
>(
  client: ApolloClientType,
  queryOrOptions: DocumentNode | QueryOptions<TVariables>,
  errorMessage = "Unexpected GraphQLErrors"
) => {
  const result = await client.query<T, TVariables>({
    fetchPolicy: "no-cache",
    ...("query" in queryOrOptions ? queryOrOptions : { query: queryOrOptions }),
  });

  throwGraphQLErrors(result, errorMessage);

  return result;
};
