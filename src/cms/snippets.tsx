import { metaFragment, RichTextBlock, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

import { Faq, faqFragment } from "./common";

export interface FaqCategorySlice {
  fields: { faq: Faq }[] | null;
  primary: {
    heading: RichTextBlock[] | null;
  };
  type: "faq_category";
}

export interface FaqCategorySnippet {
  _meta: StrictMeta;
  body: (FaqCategorySlice | null)[] | null;
}

export interface FaqCategorySnippetData {
  faqCategorySnippet: FaqCategorySnippet;
}

export const faqCategorySnippetBodyFragment = gql`
  fragment faqCategorySnippetBody on PSnippetBodyFaqCategory {
    fields {
      faq {
        ...faq
      }
    }
    primary {
      heading
    }
    type
  }
  ${faqFragment}
`;

export const faqCategorySnippetFragment = gql`
  fragment faqCategorySnippet on PSnippet {
    ...meta
    body {
      ...faqCategorySnippetBody
    }
  }
  ${faqCategorySnippetBodyFragment}
  ${metaFragment}
`;

export const FAQ_CATEGORY_SNIPPET = gql`
  query FAQ_CATEGORY_SNIPPET($handle: String!) {
    faqCategorySnippet: pSnippet(uid: $handle) {
      ...faqCategorySnippet
    }
  }
  ${faqCategorySnippetFragment}
`;
