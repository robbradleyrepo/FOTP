import { createApolloClient } from "@sss/apollo/testing";
import { defaultDataIdFromObject } from "apollo-cache-inmemory";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";
import gql from "graphql-tag";

import {
  dataIdFromObject,
  runServerSideQuery,
  sanitize,
  stringifyApolloError,
} from "../helpers";

const __typename = "Test";
const _id = "123";
const id = "abc";
const _meta = {
  id: "xyz",
};

describe("dataIdFromObject", () => {
  it("should return the value returned by `defaultDataIdFromObject` if the standard fields are available", () => {
    [
      { __typename, _id, _meta, id },
      { __typename, _id, _meta },
      { __typename, _meta, id },
    ].forEach((obj) => {
      // First we'll check that we've got a valid ID. While is dependent on
      // `defaultDataIdFromObject`, we'll likely want to update our
      // implementation if this changes.
      expect(dataIdFromObject(obj)).not.toBeNull();

      expect(dataIdFromObject(obj)).toBe(defaultDataIdFromObject(obj));
    });
  });

  it("should use the Prismic meta ID if other ID fields are not available", () => {
    expect(dataIdFromObject({ __typename, _meta })).toBe(
      `${__typename}:${_meta.id}`
    );
  });

  it("should return `null` if there is not sufficient data to generate a unique ID", () => {
    expect(dataIdFromObject({ __typename })).toBeNull();
    expect(dataIdFromObject({ _meta })).toBeNull();
    expect(dataIdFromObject({})).toBeNull();
  });

  it("should add a `:completed` suffix to completed checkouts", () => {
    const incompleteCheckout = {
      __typename: "RCheckout",
    };
    const completeCheckout = {
      ...incompleteCheckout,
      completedAt: new Date().toISOString(),
    };

    expect(dataIdFromObject(incompleteCheckout)).toBe(
      defaultDataIdFromObject(incompleteCheckout)
    );
    expect(dataIdFromObject(completeCheckout)).toBe(
      `${defaultDataIdFromObject(incompleteCheckout)}:completed`
    );
  });
});

describe("sanitize", () => {
  it("should remove all `__typename` keys", () => {
    expect(
      sanitize({
        bar: {
          __typename: "Bar",
          nested: {
            __typename: "Nested",
            value: 123,
          },
        },
        baz: "baz",
        foo: [
          { __typename: "Foo", index: 0 },
          { __typename: "Foo", index: 1 },
          { __typename: "Foo", index: 3 },
        ],
      })
    ).toMatchSnapshot();
  });
});

describe("stringifyApolloError", () => {
  const anonymizeError = <T extends Error>(error: T) => {
    error.stack = `Dummy \`${error.constructor.name ?? "Error"}\` stack`;
    return error;
  };

  it("should stringify all top-level error data", () => {
    const apolloError = anonymizeError(new ApolloError({}));

    expect(stringifyApolloError(apolloError)).toMatchSnapshot();
  });

  it("should stringify GraphQL errors", () => {
    const apolloError = anonymizeError(
      new ApolloError({
        graphQLErrors: [anonymizeError(new GraphQLError("Foo"))],
      })
    );

    expect(stringifyApolloError(apolloError)).toMatchSnapshot();
  });

  it("should stringify network errors", () => {
    const apolloError = anonymizeError(
      new ApolloError({
        networkError: anonymizeError(new Error("Bar")),
      })
    );

    expect(stringifyApolloError(apolloError)).toMatchSnapshot();
  });
});

describe("runServerSideQuery", () => {
  it("should return apollo result on success", async () => {
    const QUERY = gql`
      query {
        foo
      }
    `;
    const client = createApolloClient([
      {
        request: {
          query: QUERY,
        },
        result: {
          data: {
            foo: null,
          },
        },
      },
    ]);

    await expect(runServerSideQuery(client, QUERY)).resolves.toMatchObject({
      data: { foo: null },
    });
  });

  it("should re-raise GraphQL error", async () => {
    const QUERY = gql`
      query {
        foo
      }
    `;
    const client = createApolloClient([
      {
        request: {
          query: QUERY,
        },
        result: {
          data: {
            foo: null,
          },
          errors: [
            {
              locations: [
                {
                  column: 3,
                  line: 2,
                },
              ],
              message: "A foo error!",
              path: ["foo"],
            } as any,
          ],
        },
      },
    ]);

    await expect(runServerSideQuery(client, QUERY)).rejects.toThrowError(
      "GraphQL error: A foo error!"
    );
  });
});
