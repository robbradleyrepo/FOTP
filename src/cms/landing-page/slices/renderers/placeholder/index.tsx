import { captureException } from "@sentry/nextjs";
import React, { FC } from "react";

import { PlaceholderSlice } from "../../";
import ProductBenefits from "./product-benefits";
import ProductIngredients from "./product-ingredients";
import ProductReviews from "./product-reviews";

const placeholderRenderers: Map<string, FC> = new Map([
  ["Product Benefits", ProductBenefits],
  ["Product Ingredients", ProductIngredients],
  ["Product Reviews", ProductReviews],
  ["Yotpo Product", ProductReviews], // XXX: Handle legacy documents - new documents will use `Product Reviews` instead
]);

export const NullRenderer = ({
  primary: { placeholder },
}: PlaceholderSlice) => {
  if (!placeholder) {
    return null;
  }

  const error = new Error(`Missing renderer for placeholder "${placeholder}"`);

  if (process.env.NODE_ENV === "production") {
    captureException(error);
  } else {
    throw error;
  }

  return null;
};

const PlaceholderRenderer: FC<PlaceholderSlice> = (slice) => {
  const Renderer =
    placeholderRenderers.get(slice.primary.placeholder) ?? NullRenderer;
  return <Renderer {...slice} />;
};

export default PlaceholderRenderer;
