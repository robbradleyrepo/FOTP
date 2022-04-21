import { PageInfo, pageInfoFragment } from "@sss/prismic";
import gql from "graphql-tag";

import { VideoTestimonial, videoTestimonialFragment } from "./common";

export interface VideoTestimonials {
  edges: {
    cursor: string;
    node: VideoTestimonial;
  }[];
  pageInfo: PageInfo;
  totalCount: string;
}

export type VideoTestimonialsData = Record<
  "videoTestimonials",
  VideoTestimonials
>;

export enum VideoTestimonialSortType {
  META_FIRST_PUBLICATION_DATE_ASC = "meta_firstPublicationDate_ASC",
  META_FIRST_PUBLICATION_DATE_DESC = "meta_firstPublicationDate_DESC",
  META_LAST_PUBLICATION_DATE_ASC = "meta_lastPublicationDate_ASC",
  META_LAST_PUBLICATION_DATE_DESC = "meta_lastPublicationDate_DESC",
}

export const VIDEO_TESTIMONIALS = gql`
  query VIDEO_TESTIMONIALS(
    $after: String
    $count: Int = 10
    $sort: PSortVideoTestimonialy
  ) {
    videoTestimonials: pVideoTestimonials(
      after: $after
      first: $count
      sortBy: $sort
    ) {
      edges {
        cursor
        node {
          ...videoTestimonial
        }
      }
      pageInfo {
        ...pageInfo
      }
      totalCount
    }
  }
  ${pageInfoFragment}
  ${videoTestimonialFragment}
`;
