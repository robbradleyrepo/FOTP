import { Connection } from "@sss/ecommerce/common";
import { metaFragment } from "@sss/prismic";
import gql from "graphql-tag";

import { Study, StudyData } from "./study";

export interface EvidencePage {
  keyStudies: StudyData[] | null;
}

export type EvidencePageData = Record<"evidencePage", EvidencePage>;

export const studyFragment = gql`
  fragment study on PStudy {
    ...meta
    authors {
      author
    }
    diagram
    doubleBlind
    duration
    focus {
      ... on PIngredient {
        ...meta
        image
        productName
        summary
        type
      }
    }
    link {
      ... on _ExternalLink {
        url
      }
    }
    message
    pageReference
    participants
    placeboControlled
    publication
    randomised
    sponsor
    title
    type
    year
  }
`;

export const EVIDENCE_PAGE = gql`
  query EVIDENCE_PAGE($handle: String!) {
    evidencePage: pEvidencePage(uid: $handle) {
      keyStudies {
        study {
          ...study
        }
      }
    }
  }
  ${metaFragment}
  ${studyFragment}
`;

export interface StudyCountData {
  directlyFocusedStudies: {
    totalCount: number;
  };
  studies: {
    totalCount: number;
  };
}

export const STUDY_COUNT = gql`
  query STUDY_COUNT {
    directlyFocusedStudies: pStudys(
      first: 1
      where: { directly_focused: true }
    ) {
      totalCount
    }
    studies: pStudys {
      totalCount
    }
  }
`;

export type StudiesData = Record<"studies", Connection<Study>>;

export type StudiesForIngredient = Pick<
  Study,
  | "_meta"
  | "title"
  | "link"
  | "authors"
  | "year"
  | "publication"
  | "pageReference"
>;

export type StudiesForIngredientData = Record<
  "studies",
  Connection<StudiesForIngredient>
>;

export const STUDIES_FOR_INGREDIENT = gql`
  query STUDIES_FOR_INGREDIENT($ingredientId: String!) {
    studies: pStudys(where: { focus: $ingredientId }, sortBy: year_DESC) {
      edges {
        node {
          ...meta
          title
          link {
            ... on _ExternalLink {
              url
            }
          }
          authors {
            author
          }
          year
          publication
          pageReference
        }
      }
    }
  }
  ${metaFragment}
`;

export const returnReference = ({
  authors,
  year,
  publication,
  pageReference,
}: Study) => {
  if (authors && year) {
    const author =
      authors.length > 1 ? `${authors[0].author} et al` : authors[0].author;
    const pageRef = pageReference && publication ? `, ${pageReference}` : "";

    return `${author} (${year}). ${publication}${pageRef}`;
  } else {
    return null;
  }
};
