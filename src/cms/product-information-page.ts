import { metaFragment, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

import { Product, productFragment } from "./product";
import { FaqCategorySnippet, faqCategorySnippetFragment } from "./snippets";

export interface ProductInformationPage {
  _meta: StrictMeta;
  faqs: FaqCategorySnippet | null;
  product: Product | null;
  seoDescription: string | null;
  seoTitle: string | null;
  socialMediaDescription: string | null;
  socialMediaTitle: string | null;
}

export interface ProductInformationPageData {
  productInformationPage: ProductInformationPage;
}

const productInformationPageFragment = gql`
  fragment productInformationPage on PProductInformationPage {
    ...meta
    faqs {
      ...faqCategorySnippet
    }
    product {
      ...pProduct
    }
    seoDescription
    seoTitle
    socialMediaDescription
    socialMediaTitle
  }
  ${faqCategorySnippetFragment}
  ${metaFragment}
  ${productFragment}
`;

export const PRODUCT_INFORMATION_PAGE = gql`
  query PRODUCT_INFORMATION_PAGE($handle: String!) {
    productInformationPage: pProductInformationPage(uid: $handle) {
      ...productInformationPage
    }
  }
  ${productInformationPageFragment}
`;
