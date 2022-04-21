import gql from "graphql-tag";

import { Ingredient, ingredientFragment } from "./ingredient";

export interface IngredientsPage {
  ingredients: Record<"ingredient", Ingredient>[] | null;
}

export type IngredientsPageData = Record<"ingredientsPage", IngredientsPage>;

export const INGREDIENTS_PAGE = gql`
  query INGREDIENTS_PAGE {
    ingredientsPage: pIngredientsPage(uid: "ingredients-page") {
      ingredients {
        ingredient {
          ... on PIngredient {
            ...ingredient
          }
        }
      }
    }
  }
  ${ingredientFragment}
`;
