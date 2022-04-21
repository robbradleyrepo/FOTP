import { act, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { IngredientData } from "../../../cms/ingredient";
import * as cms from "../../../cms/testing";
import { anonymous } from "../../../sandbox";
import { IngredientsGrid } from "../ingredients";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ingredients = (cms.mockedResponses.productPage.subscription as any)[0]
  .result.data.productPage.product.ingredients as IngredientData[];

describe("<IngredientsGrid />", () => {
  it("should render a 'view all' button if there are more cards than the `initialShowCount`", async () => {
    const { component } = await anonymous.component({
      Component: (
        <IngredientsGrid ingredients={ingredients} initialShowCount={2} />
      ),
    });

    const showMoreButton = component.getByText(
      `View all ${ingredients.length}`
    );

    expect(showMoreButton).toBeInTheDocument();
  });

  it("should not render a 'view all' button if there the same number or more cards than the `initialShowCount`", async () => {
    for (const initialShowCount of [
      ingredients.length,
      ingredients.length + 1,
    ]) {
      const { component } = await anonymous.component({
        Component: (
          <IngredientsGrid
            ingredients={ingredients}
            initialShowCount={initialShowCount}
          />
        ),
      });

      expect(() =>
        component.getByText(`View all ${ingredients.length}`)
      ).toThrow();
    }
  });

  it.skip("should hide the cards that have an index greater than `initialShowCount`", async () => {
    // TODO: This currently breaks as the css prop transform is ignored by our jest config.
    const initialShowCount = 3;

    const { component } = await anonymous.component({
      Component: (
        <IngredientsGrid
          ingredients={ingredients}
          initialShowCount={initialShowCount}
        />
      ),
    });

    const buttons = component.getAllByRole("button");

    expect(buttons).toHaveLength(initialShowCount + 1); // 3 × IngredientCard + 1 × SecondaryButton
  });

  it("should reveal all cards when the user clicks on the 'view all'", async () => {
    const { component } = await anonymous.component({
      Component: (
        <IngredientsGrid ingredients={ingredients} initialShowCount={3} />
      ),
    });

    const showMoreButton = component.getByText(
      `View all ${ingredients.length}`
    );

    act(() => {
      fireEvent.click(showMoreButton);
    });

    await waitFor(() => {
      expect(showMoreButton).not.toBeInTheDocument();
      expect(component.getAllByRole("button")).toHaveLength(
        ingredients.length // 5 × IngredientCard
      );
    });
  });
});
