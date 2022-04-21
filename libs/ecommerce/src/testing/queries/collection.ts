import { MockedResponse } from "@apollo/react-testing";

import { COLLECTION_NAVIGATION } from "../../collection";
import { productCoreMove, productCoreTheOne } from "./product";

const core: MockedResponse = {
  request: {
    query: COLLECTION_NAVIGATION,
    variables: {
      first: 12,
    },
  },
  result: {
    data: {
      collection: {
        __typename: "Collection",
        description: "",
        handle: "navigation",
        products: {
          __typename: "ProductConnection",
          edges: [
            {
              __typename: "ProductEdge",
              node: productCoreTheOne,
            },
            {
              __typename: "ProductEdge",
              node: productCoreMove,
            },
          ],
        },
        title: "Navigation",
      },
    },
  },
};

export default {
  core,
};
