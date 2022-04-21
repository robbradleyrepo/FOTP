import { metaFragment, Review, reviewFragment, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

export interface ProductsPage {
  _meta: StrictMeta;
  reviews: Record<"review", Review | null>[] | null;
}

export interface ProductsPageData {
  productsPage: ProductsPage;
}

const productsPage = gql`
  fragment productsPage on PProductsPage {
    ...meta
    reviews {
      review {
        ...review
      }
    }
  }
  ${metaFragment}
  ${reviewFragment}
`;

export const PRODUCTS_PAGE = gql`
  query PRODUCTS_PAGE {
    productsPage: pProductsPage(uid: "products") {
      ...productsPage
    }
  }
  ${productsPage}
`;
