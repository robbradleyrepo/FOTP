import { RichTextBlock } from "@sss/prismic";
import gql from "graphql-tag";

interface Question {
  answer: RichTextBlock[] | null;
  question: RichTextBlock[] | null;
}

export interface VetPage {
  questions: Question[] | null;
}

export type VetPageData = Record<"vetPage", VetPage>;

export const VET_PAGE = gql`
  query VET_PAGE {
    vetPage: pVetPage(uid: "vet-page") {
      questions {
        answer
        question
      }
    }
  }
`;
