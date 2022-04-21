import { Meta, metaFragment } from "@sss/prismic";
import gql from "graphql-tag";

import { Faq } from "./common";

interface Body {
  fields: Field[] | null;
  primary: Primary | null;
}

export interface Field {
  faq: Faq | null;
}

export interface Primary {
  label: string | null;
}

export interface FAQData {
  _meta: Meta;
  body: Body[] | null;
}

export type FAQPageData = Record<"faqPage", FAQData>;

export const FAQ_PAGE = gql`
  query FAQ_PAGE {
    faqPage: pFaqPage(uid: "faq-page") {
      ...meta
      body {
        ... on PFaqPageBodyFaqCategory {
          fields {
            faq {
              ... on PFaq {
                question
                answer
              }
            }
          }
          primary {
            label
          }
        }
      }
    }
  }
  ${metaFragment}
`;
