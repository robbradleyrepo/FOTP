import gql from "graphql-tag";

export const CUSTOMIZATION = gql`
  query CUSTOMIZATION($handle: String!) {
    pCustomization(uid: $handle) {
      body {
        ... on PCustomizationBodyImageCustomization {
          primary {
            image
            target
          }
          type
        }
        ... on PCustomizationBodyRichTextCustomization {
          primary {
            richText
            target
          }
          type
        }
        ... on PCustomizationBodyTitleCustomization {
          primary {
            target
            title
          }
          type
        }
      }
    }
  }
`;
