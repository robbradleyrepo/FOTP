import {
  ArticlePageTag,
  Image,
  linkFragment,
  metaFragment,
  PageInfo,
  pageInfoFragment,
  Person,
  personFragment,
  RichTextBlock,
  Similar,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";

import { Expert, expertCoreFragment } from "../../cms/common";
import { ArticlePageSlice } from "./slices";

export enum ArticlePageSortType {
  ARTICLE_TYPE_ASC = "article_type_ASC",
  ARTICLE_TYPE_DESC = "article_type_DESC",
  META_FIRSTPUBLICATIONDATE_ASC = "meta_firstPublicationDate_ASC",
  META_FIRSTPUBLICATIONDATE_DESC = "meta_firstPublicationDate_DESC",
  META_LASTPUBLICATIONDATE_ASC = "meta_lastPublicationDate_ASC",
  META_LASTPUBLICATIONDATE_DESC = "meta_lastPublicationDate_DESC",
  PUBLICATION_DATE_ASC = "publication_date_ASC",
  PUBLICATION_DATE_DESC = "publication_date_DESC",
  SEO_DESCRIPTION_ASC = "seo_description_ASC",
  SEO_DESCRIPTION_DESC = "seo_description_DESC",
  SEO_TITLE_ASC = "seo_title_ASC",
  SEO_TITLE_DESC = "seo_title_DESC",
  SOCIAL_MEDIA_DESCRIPTION_ASC = "social_media_description_ASC",
  SOCIAL_MEDIA_DESCRIPTION_DESC = "social_media_description_DESC",
  SOCIAL_MEDIA_TITLE_ASC = "social_media_title_ASC",
  SOCIAL_MEDIA_TITLE_DESC = "social_media_title_DESC",
  TITLE_ASC = "title_ASC",
  TITLE_DESC = "title_DESC",
}

export interface ArticlePage extends ArticlePageCore {
  approver: Expert | null;
  body: ArticlePageSlice[] | null;
  seoDescription: string | null;
  seoTitle: string | null;
  socialMediaDescription: string | null;
  socialMediaImage: Image | null;
  socialMediaTitle: string | null;
}

export interface ArticlePageCore {
  _meta: StrictMeta;
  author: Expert | Person | null;
  approver: Expert | null;
  publicationDate: string | null;
  summary: string | null;
  thumbnail: Image | null;
  title: RichTextBlock[] | null;
}

export type ArticlePageData = Record<"articlePage", ArticlePage>;

export interface ArticlePageListingData {
  articlePages: {
    edges: { cursor: string; node: ArticlePageCore }[];
    pageInfo: PageInfo;
    totalCount: string;
  };
}

export interface ArticlePageListingVariables {
  after?: string;
  first?: number;
  similar?: Similar;
  sortBy?: ArticlePageSortType;
  tags?: ArticlePageTag[];
}

export const articlePageCoreFragment = gql`
  fragment articlePageCore on PArticlePage {
    ...meta
    author {
      ...expertCore
      ...person
    }
    approver {
      ...expertCore
    }
    publicationDate
    summary
    thumbnail
    title
  }
  ${expertCoreFragment}
  ${metaFragment}
  ${personFragment}
`;

export const ARTICLE_PAGE = gql`
  query ARTICLE_PAGE($handle: String!) {
    articlePage: pArticlePage(uid: $handle) {
      ...articlePageCore
      body {
        ... on PArticlePageBodyImage {
          primary {
            image
            caption
            link {
              ...link
            }
          }
          type
        }
        ... on PArticlePageBodyProduct {
          primary {
            product {
              ...link
            }
          }
          type
        }
        ... on PArticlePageBodyQuote {
          primary {
            attribution
            quote
          }
          type
        }
        ... on PArticlePageBodyRichText {
          label
          primary {
            content
          }
          type
        }
        ... on PArticlePageBodyYoutube {
          primary {
            videoId
          }
          type
        }
      }
      seoDescription
      seoTitle
      socialMediaDescription
      socialMediaImage
      socialMediaTitle
    }
  }
  ${articlePageCoreFragment}
  ${expertCoreFragment}
  ${linkFragment}
`;

export const ARTICLE_PAGES = gql`
  query ARTICLE_PAGES(
    $after: String
    $first: Int = 5
    $similar: Psimilar
    $sortBy: PSortArticlePagey = publication_date_DESC
    $tags: [String!]
  ) {
    articlePages: pArticlePages(
      after: $after
      first: $first
      similar: $similar
      sortBy: $sortBy
      tags: $tags
    ) {
      edges {
        cursor
        node {
          ...articlePageCore
        }
      }
      pageInfo {
        ...pageInfo
      }
      totalCount
    }
  }
  ${articlePageCoreFragment}
  ${pageInfoFragment}
`;
