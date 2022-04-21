import { documentResolver, Image, RichTextFragment } from "@sss/prismic";
import React, { ReactNode } from "react";

import { getIngredientTitle, Ingredient } from "../../../cms/ingredient";

export type CoreIngredientProperties = {
  id: string;
  image: Image;
  subtitle?: ReactNode;
  summary: ReactNode;
  title: ReactNode;
  url: string;
};

export const mapCmsIngredientToCoreIngredientProperties = ({
  _meta,
  image,
  productName,
  summary: summaryBlock,
  type,
}: Ingredient): CoreIngredientProperties => {
  const title = getIngredientTitle({ productName, type });

  const subtitleBlock = !title ? productName : null;

  if (!title) {
    throw new Error("Missing ingredient title");
  }

  if (!image) {
    throw new Error("Missing ingredient image");
  }

  if (!summaryBlock) {
    throw new Error("Missing ingredient summary");
  }

  return {
    id: _meta.id,
    image,
    subtitle: subtitleBlock ? (
      <RichTextFragment render={subtitleBlock} />
    ) : undefined,
    summary: <RichTextFragment render={summaryBlock} />,
    title,
    url: documentResolver({ _meta }),
  };
};
