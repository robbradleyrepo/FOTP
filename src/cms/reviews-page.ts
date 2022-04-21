import { metaFragment, Review, reviewFragment, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

export interface ReviewsPage {
  _meta: StrictMeta;
  reviews: Record<"review", Review | null>[] | null;
}

export interface ReviewsPageData {
  reviewsPage: ReviewsPage;
  videoTestimonials: {
    totalCount: string;
  };
}

export const REVIEWS_PAGE = gql`
  query REVIEWS_PAGE {
    reviewsPage: pReviewsPage(uid: "reviews-page") {
      ...meta
      reviews {
        review {
          ...review
        }
      }
    }
    videoTestimonials: pVideoTestimonials(first: 1) {
      totalCount
    }
  }
  ${metaFragment}
  ${reviewFragment}
`;
