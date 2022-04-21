import { ApolloClientType } from "@sss/apollo";
import * as ecommerce from "@sss/ecommerce/product";
import {
  Image,
  metaFragment,
  Review,
  reviewFragment,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import { ApolloError } from "apollo-client";
import gql from "graphql-tag";
import React, { createContext, FC, useContext } from "react";

import { makeStaticPropsGetter, StaticPropsGetter } from "../../pages/_app";
import { expertFragment, ExpertQuote } from "./common";
import { Ingredient, ingredientFragment } from "./ingredient";
import { Product, productFragment } from "./product";
import { FaqCategorySnippet, faqCategorySnippetFragment } from "./snippets";

export type PlaceholderSliceType =
  | "add_to_cart"
  | "benefits"
  | "ingredients_and_details"
  | "natural_features"
  | "reviews";

export interface PlaceholderSlice {
  primary: {
    content: PlaceholderSliceType;
  } | null;
  type: "placeholder";
}

export interface ProductPage {
  _meta: StrictMeta;
  expertQuotes: ExpertQuote[] | null;
  faqs: FaqCategorySnippet | null;
  keyFeaturesContent: RichTextBlock[] | null;
  keyFeaturesImage: Image | null;
  keyFeaturesTitle: RichTextBlock[] | null;
  keyIngredients: Record<"ingredient", Ingredient | null>[] | null;
  keyIngredientsIntro: RichTextBlock[] | null;
  keyIngredientsTitle: RichTextBlock[] | null;
  product: Product | null;
  reviews: Record<"review", Review | null>[] | null;
  reviewsHighlights: Record<"highlight", RichTextBlock[] | null>[] | null;
  usageImage: Image | null;
  usageIntro: RichTextBlock[] | null;
  usageTitle: RichTextBlock[] | null;
}

export interface ProductPageData {
  productPage: ProductPage;
}

const productPage = gql`
  fragment productPage on PProductPage {
    ...meta
    expertQuotes {
      expert {
        ...expert
      }
      quote
    }
    faqs {
      ...faqCategorySnippet
    }
    keyFeaturesContent
    keyFeaturesImage
    keyFeaturesTitle
    keyIngredients {
      ingredient {
        ...ingredient
      }
    }
    keyIngredientsIntro
    keyIngredientsTitle
    product {
      ...pProduct
    }
    reviews {
      review {
        ...review
      }
    }
    reviewsHighlights {
      highlight
    }
    usageImage
    usageIntro
    usageTitle
  }
  ${expertFragment}
  ${faqCategorySnippetFragment}
  ${ingredientFragment}
  ${metaFragment}
  ${reviewFragment}
  ${productFragment}
`;

export const PRODUCT_PAGE = gql`
  query PRODUCT_PAGE($handle: String!) {
    productPage: pProductPage(uid: $handle) {
      ...productPage
    }
  }
  ${productPage}
`;

export interface UnifiedProductPageData {
  cms: ProductPage;
  ecommerce: ecommerce.Product;
}

export const getUnifiedProductPageData = async (
  client: ApolloClientType,
  handle: string
): Promise<Pick<UnifiedProductPageData, "cms" | "ecommerce"> | null> => {
  const [productPageResult, productResult] = await Promise.all(
    [PRODUCT_PAGE, ecommerce.PRODUCT_BY_HANDLE].map((query) =>
      client.query({ fetchPolicy: "no-cache", query, variables: { handle } })
    )
  );

  const errors = [
    ...(productPageResult.errors ?? []),
    ...(productResult.errors ?? []),
  ];

  if (errors.length > 0) {
    throw new ApolloError({
      errorMessage: `Failed to fetch unified product data for ${handle}`,
      extraInfo: {
        handle,
      },
      graphQLErrors: errors,
    });
  }

  if (productPageResult.data?.productPage && productResult.data?.product) {
    return {
      cms: productPageResult.data.productPage,
      ecommerce: productResult.data.product,
    };
  }

  return null;
};

type PropGetterTransform = (
  result: { props: { data: UnifiedProductPageData }; revalidate: number },
  ...rest: Parameters<StaticPropsGetter>
) => ReturnType<StaticPropsGetter>;

export const makeProductPageStaticPropsGetter = (
  staticHandle?: string,
  transform: PropGetterTransform = async (result) => result
) =>
  makeStaticPropsGetter(async (context, common) => {
    let handle = staticHandle;

    if (!handle) {
      const dynamicHandle = context.params?.handle;

      if (typeof dynamicHandle !== "string") {
        throw new Error(
          `Invalid param "handle": expected string, got "${typeof dynamicHandle}"`
        );
      }

      handle = dynamicHandle;
    }

    const data = await getUnifiedProductPageData(common.apolloClient, handle);

    if (!data) {
      // Missing product page.
      return { notFound: true };
    }

    return transform(
      {
        props: { data: { ...data } },
        revalidate: 60,
      },
      context,
      common
    );
  });

export type UnifiedProductPageDataWithMetadata = UnifiedProductPageData & {
  meta: ecommerce.ProductComputedMetadata;
};

const ProductPageDataContext = createContext<UnifiedProductPageDataWithMetadata | null>(
  null
);

type ProductPageDataContextProps = UnifiedProductPageDataWithMetadata;

export const ProductPageDataProvider: FC<ProductPageDataContextProps> = ({
  children,
  cms,
  ecommerce,
  meta,
}) => (
  <ProductPageDataContext.Provider value={{ cms, ecommerce, meta }}>
    {children}
  </ProductPageDataContext.Provider>
);

export const useProductPageData = (): UnifiedProductPageDataWithMetadata => {
  const context = useContext(ProductPageDataContext);

  if (!context) {
    throw new Error(
      "`useProductData` must be used inside a `ProductDataProvider`"
    );
  }

  return context;
};
