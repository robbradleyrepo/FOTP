import {
  metaFragment,
  Review,
  reviewFragment,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";

import { FaqCategorySnippet, faqCategorySnippetFragment } from "./snippets";

export interface LeadCapturePage {
  _meta: StrictMeta;
  faqs: FaqCategorySnippet | null;
  reviews: Record<"review", Review | null>[] | null;
  reviewsHighlights: Record<"highlight", RichTextBlock[] | null>[] | null;
}

export interface LeadCapturePageData {
  leadCapturePage: LeadCapturePage;
}

const leadCapturePage = gql`
  fragment leadCapturePage on PLeadCapturePage {
    ...meta
    faqs {
      ...faqCategorySnippet
    }
    reviews {
      review {
        ...review
      }
    }
    reviewsHighlights {
      highlight
    }
  }
  ${faqCategorySnippetFragment}
  ${metaFragment}
  ${reviewFragment}
`;

export const LEAD_CAPTURE_PAGE = gql`
  query PRODUCT_PAGE($handle: String!) {
    leadCapturePage: pLeadCapturePage(uid: $handle) {
      ...leadCapturePage
    }
  }
  ${leadCapturePage}
`;
