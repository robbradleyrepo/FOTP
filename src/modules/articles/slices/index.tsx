import type { Discount, Money } from "@sss/ecommerce/common";
import type { Image } from "@sss/ecommerce/product";
import {
  ContentSlice,
  ContentSliceRenderer,
  ContentSliceRendererComponents,
  DocumentLink,
  Slice,
} from "@sss/prismic";
import React, { createContext, FC, useContext } from "react";

import * as contentRenderers from "../../../cms/slices/renderers";
import * as articlePageRenderers from "./renderers";

export interface ArticlePageProductSlice extends Slice {
  primary: {
    product: DocumentLink | null;
  };
  type: "product";
}

export type ArticlePageSlice = ContentSlice | ArticlePageProductSlice;

export interface ArticlePageProductSummary {
  currentDiscount: Discount | null;
  currentPrice: Money;
  image: Image;
  handle: string;
  regularPrice: Money;
  subtitle?: string;
  title: string;
}

export type ArticlePageProductSummaryDict = Record<
  string,
  ArticlePageProductSummary
>;

interface ArticlePageSliceRendererComponents {
  ProductRenderer: FC<ArticlePageProductSlice>;
}

const defaultRenderers: Omit<
  ContentSliceRendererComponents,
  "FallbackRenderer"
> &
  ArticlePageSliceRendererComponents = {
  ...contentRenderers,
  ...articlePageRenderers,
};

type ArticlePageSliceRendererProps = ArticlePageSlice & {
  renderers?: Partial<
    ContentSliceRendererComponents & ArticlePageSliceRendererComponents
  >;
};

export const ArticlePageSliceRenderer: FC<ArticlePageSliceRendererProps> = ({
  renderers,
  ...slice
}) => {
  const combinedRenderers = {
    ...defaultRenderers,
    ...renderers,
  };

  const { ProductRenderer } = combinedRenderers;

  switch (slice.type) {
    case "product":
      return <ProductRenderer {...slice} />;
    default:
      return <ContentSliceRenderer renderers={combinedRenderers} {...slice} />;
  }
};

interface ArticlePageSliceZoneContextProps {
  products: ArticlePageProductSummaryDict;
}

const ArticlePageSliceZoneContext = createContext<ArticlePageSliceZoneContextProps | null>(
  null
);

const ArticlePageSliceZoneContextProvider: FC<ArticlePageSliceZoneContextProps> = ({
  children,
  ...value
}) => (
  <ArticlePageSliceZoneContext.Provider value={value}>
    {children}
  </ArticlePageSliceZoneContext.Provider>
);

export const useArticlePageSliceZoneContext = () => {
  const context = useContext(ArticlePageSliceZoneContext);

  if (!context) {
    throw new Error(
      "`useArticlePageSliceZoneContext` must be used inside a `ArticlePageSliceZoneContextProvider`"
    );
  }

  return context;
};

type ArticlePageSliceZoneProps = ArticlePageSliceZoneContextProps &
  Pick<ArticlePageSliceRendererProps, "renderers"> & {
    slices: ArticlePageSlice[];
  };

export const ArticlePageSliceZone: FC<ArticlePageSliceZoneProps> = ({
  renderers,
  slices,
  ...rest
}) => (
  <ArticlePageSliceZoneContextProvider {...rest}>
    {slices.map((slice, index) => (
      <ArticlePageSliceRenderer key={index} renderers={renderers} {...slice} />
    ))}
  </ArticlePageSliceZoneContextProvider>
);
