import gql from "graphql-tag";

import type { Connection } from "./common";
import { Product, productCoreFragment, productFragment } from "./product";

export interface Collection<T = Product> {
  description: string;
  handle: string;
  products: Connection<T>;
  title: string;
}

export interface CollectionData<T = Product> {
  collection: Collection<T>;
}

export const COLLECTION_BY_HANDLE = gql`
  query COLLECTION_BY_HANDLE($first: Int = 12, $handle: String!) {
    collection: collectionByHandle(handle: $handle) {
      description
      handle
      products(first: $first) {
        edges {
          node {
            ...product
          }
        }
      }
      title
    }
  }
  ${productFragment}
`;

export const COLLECTION_BY_HANDLE_CORE = gql`
  query COLLECTION_BY_HANDLE_CORE($first: Int = 12, $handle: String!) {
    collection: collectionByHandle(handle: $handle) {
      description
      handle
      products(first: $first) {
        edges {
          node {
            ...productCore
          }
        }
      }
      title
    }
  }
  ${productCoreFragment}
`;

export const COLLECTION_NAVIGATION = gql`
  query COLLECTION_NAVIGATION($first: Int = 12) {
    collection: collectionByHandle(handle: "navigation") {
      description
      handle
      products(first: $first) {
        edges {
          node {
            ...productCore
          }
        }
      }
      title
    }
  }
  ${productCoreFragment}
`;
