import { Image, Meta, metaFragment, RichTextBlock } from "@sss/prismic";
import gql from "graphql-tag";

export interface Lab {
  _meta: Meta;
  description: RichTextBlock[] | null;
  logo: Image | null;
  name: RichTextBlock[] | null;
  website: {
    url: string;
  } | null;
}

export interface LabTest {
  _meta: Meta;
  description: RichTextBlock[] | null;
  title: RichTextBlock[] | null;
}

export interface TestingPage {
  labs: Record<"lab", Lab>[] | null;
  tests: Record<"test", LabTest>[] | null;
}

export type TestingPageData = Record<"testingPage", TestingPage>;

export const TESTING_PAGE = gql`
  query TESTING_PAGE {
    testingPage: pTestingPage(uid: "testing-page") {
      tests {
        test {
          ... on PLabTest {
            ...meta
            title
            description
          }
        }
      }
      labs {
        lab {
          ... on PLab {
            name
            logo
            description
            website {
              ... on _ExternalLink {
                _linkType
                url
              }
            }
          }
        }
      }
    }
  }
  ${metaFragment}
`;
