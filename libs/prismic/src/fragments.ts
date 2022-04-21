import gql from "graphql-tag";

export const metaFragment = gql`
  fragment meta on _Document {
    _meta {
      id
      lang
      lastPublicationDate
      tags
      type
      uid
    }
  }
`;

export const linkFragment = gql`
  fragment link on _Linkable {
    ...meta
    _linkType
    ... on _ExternalLink {
      url
    }
    ... on _FileLink {
      name
      size
      url
    }
  }
  ${metaFragment}
`;

export const pageInfoFragment = gql`
  fragment pageInfo on PPageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;

export const personFragment = gql`
  fragment person on PPerson {
    image
    name
    role
  }
`;

export const reviewFragment = gql`
  fragment review on PReview {
    ...meta
    body
    easeOfUse
    effectiveness
    highlight
    image
    rating
    reviewer
    title
  }
  ${metaFragment}
`;
