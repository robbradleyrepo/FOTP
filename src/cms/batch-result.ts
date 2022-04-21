import { Meta, metaFragment } from "@sss/prismic";
import gql from "graphql-tag";

import { LabTest } from "./testing-page";

interface Body {
  fields: Field[] | null;
  primary: Primary | null;
}

export interface Field {
  report: {
    name: string | null;
    url: string | null;
  } | null;
  reportLabel: string | null;
}

export interface Primary {
  labTest: LabTest | null;
  status: string | null;
}

export interface BatchResult {
  _meta: Meta;
  body: Body[] | null;
  productHandle: string | null;
  status: string | null;
  title: string | null;
}

export type BatchResultData = Record<"result", BatchResult>;

export const BATCH_RESULT = gql`
  query BATCH_CODE($handle: String!) {
    result: pBatchResult(uid: $handle) {
      ...meta
      body {
        ... on PBatchResultBodyResult {
          fields {
            reportLabel
            report {
              ... on _FileLink {
                name
                url
              }
            }
          }
          primary {
            status
            labTest {
              ... on PLabTest {
                ...meta
                title
                description
              }
            }
          }
        }
      }
      productHandle
      status
      title
    }
  }
  ${metaFragment}
`;
