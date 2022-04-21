import { metaFragment } from "@sss/prismic";
import gql from "graphql-tag";

export const QUERY_EDUCATION_COURSES = gql`
  query QUERY_EDUCATION_COURSES {
    educationCourses: pEducationCourses {
      edges {
        node {
          videos {
            video {
              ... on PEducationVideo {
                ...meta
              }
            }
          }
          ...meta
        }
      }
    }
    ${metaFragment}
  }
`;

export const QUERY_EDUCATION_COURSE = gql`
  query QUERY_EDUCATION_COURSE($id: String!) {
    educationCourse: pEducationCourse(uid: $id) {
      courseHighlights
      description
      klaviyoId
      expert {
        ... on PExpert {
          image
          name
          role
          summary
          ...meta
        }
      }
      heroImage
      seoDescription
      seoTitle
      socialMediaDescription
      socialMediaTitle
      title
      videos {
        video {
          ... on PEducationVideo {
            description
            duration
            seoDescription
            seoTitle
            socialMediaDescription
            socialMediaTitle
            summary
            thumbnail
            title
            youtubeId
            ...meta
          }
        }
      }
      youtubePlaylistUrl
      ...meta
    }
  }
  ${metaFragment}
`;
