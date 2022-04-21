import { Image, metaFragment, RichTextBlock, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

import { Benefit, benefitFragment, Info } from "../common";
import { Ingredient, ingredientFragment } from "../ingredient";

export type MacronutrientFacts = Record<
  | "calories"
  | "caloriesFromFat"
  | "dietaryFiber"
  | "disclaimer"
  | "protein"
  | "servingSize"
  | "servingsPerContainer"
  | "sugars"
  | "totalFat"
  | "totalCarbohydrate",
  RichTextBlock[] | null
>;

export interface Product {
  _meta: StrictMeta;
  announcement: RichTextBlock[] | null;
  announcementEnabled: boolean;
  benefits: Record<"benefit", Benefit>[] | null;
  description: RichTextBlock[] | null;
  ingredients: Record<"ingredient", Ingredient>[] | null;
  ingredientsCallToAction: RichTextBlock[] | null;
  ingredientsDescription: RichTextBlock[] | null;
  ingredientsTitle: RichTextBlock[] | null;
  macronutrientFacts: MacronutrientFacts[] | null;
  otherIngredients: RichTextBlock[] | null;
  servingSizes: Info[] | null;
  socialMediaDescription: string | null;
  socialMediaImage: Image | null;
  socialMediaTitle: string | null;
  suitability: RichTextBlock[] | null;
  typicalValues: Info[] | null;
  typicalValuesLabel: RichTextBlock[] | null;
  use: RichTextBlock[] | null;
}

export const productFragment = gql`
  fragment pProduct on PProduct {
    ...meta
    announcement
    announcementEnabled
    benefits {
      ... on PProductBenefits {
        benefit {
          ...benefit
        }
      }
    }
    description
    ingredients {
      ... on PProductIngredients {
        ingredient {
          ...ingredient
        }
      }
    }
    ingredientsCallToAction
    ingredientsDescription
    ingredientsTitle
    macronutrientFacts {
      calories
      caloriesFromFat
      dietaryFiber
      disclaimer
      protein
      servingSize
      servingsPerContainer
      sugars
      totalFat
      totalCarbohydrate
    }
    otherIngredients
    servingSizes {
      name
      value
    }
    socialMediaDescription
    socialMediaImage
    socialMediaTitle
    suitability
    typicalValues {
      name
      value
    }
    typicalValuesLabel
    use
  }
  ${benefitFragment}
  ${ingredientFragment}
  ${metaFragment}
`;
