import {
  Image,
  LatLng,
  metaFragment,
  renderAsString,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";

import { Info } from "./common";
import { studyFragment } from "./evidence-page";
import { Study } from "./study";

export interface Ingredient {
  _meta: StrictMeta;
  advantageDescription: RichTextBlock[] | null;
  advantageTitle: RichTextBlock[] | null;
  benefits: RichTextBlock[] | null;
  description: RichTextBlock[] | null;
  effects: RichTextBlock[] | null;
  image: Image | null;
  productName: RichTextBlock[] | null;
  sourceLatLng: LatLng | null;
  specifications: Info[] | null;
  summary: RichTextBlock[] | null;
  type: RichTextBlock[] | null;
  heroStudy: Study | null;
}

export interface IngredientData {
  ingredient: Ingredient;
}

export const ingredientFragment = gql`
  fragment ingredient on PIngredient {
    ...meta
    advantageDescription
    advantageTitle
    benefits
    description
    effects
    image
    productName
    sourceLatLng
    specifications {
      name
      value
    }
    summary
    type
  }
  ${metaFragment}
`;

export const INGREDIENT = gql`
  query INGREDIENT($handle: String!) {
    ingredient: pIngredient(uid: $handle) {
      ...ingredient
      heroStudy {
        ...study
      }
    }
  }
  ${ingredientFragment}
  ${studyFragment}
`;

export const INGREDIENTS_BY_HANDLE = gql`
  query INGREDIENTS_BY_HANDLE($handles: [String!]!) {
    ingredients: pIngredients(uid_in: $handles) {
      edges {
        node {
          ...ingredient
        }
      }
    }
  }
  ${ingredientFragment}
`;

interface IngredientTitle {
  productName: RichTextBlock[] | null;
  type: RichTextBlock[] | null;
}

export const getIngredientTitle = ({ productName, type }: IngredientTitle) => {
  const ingredientName = productName && renderAsString(productName).trim();
  const ingredientType = type && renderAsString(type).trim();

  return ingredientType || ingredientName;
};
