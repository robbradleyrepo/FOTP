import { Review, reviewFragment } from "@sss/prismic";
import gql from "graphql-tag";

import { Testimonial } from "../../cms/common";
export interface HomePage {
  reviews: Record<"review", Review>[] | null;
  testimonials: Record<"testimonial", Testimonial>[] | null;
}
export interface HomePageData {
  homePage: HomePage;
}
export const HOME_PAGE = gql`
  query HOME_PAGE {
    homePage: pHomePage(uid: "home-page") {
      reviews {
        ... on PHomePageReviews {
          review {
            ...review
          }
        }
      }
      testimonials {
        ... on PHomePageTestimonials {
          testimonial {
            ... on PTestimonial {
              quote
              image
              attribution
            }
          }
        }
      }
    }
  }
  ${reviewFragment}
`;
