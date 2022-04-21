import { runServerSideQuery } from "@sss/apollo";
import type { CollectionData } from "@sss/ecommerce/collection";
import type { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect } from "react";
import { PageSpinner } from "src/ui/base/spinner";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import { useDogProfile } from "../../../dogs/profile";

const getRecommendationPathname = ({ handle }: Product) =>
  `/food/plan/recommendation/${handle}`;

interface FoodPlanFlavorStepProps {
  products: Product[];
}

const FoodPlanFlavorStep: FC<FoodPlanFlavorStepProps> = ({ products }) => {
  const { t } = useLocale();
  const router = useRouter();

  const uuid =
    typeof router.query.dog_profile === "string"
      ? router.query.dog_profile
      : null;

  const { data, error, loading } = useDogProfile(uuid);

  const redirect = useCallback(
    (product: Product, method: "push" | "replace" = "push") =>
      router[method]({
        pathname: getRecommendationPathname(product),
        query: { dog_profile: uuid },
      }),
    [router, uuid]
  );

  // For now we can assume that the first product is the product we want to
  // redirect to, as we'll throw an error in `getStaticProps` if there's more
  // than one. Once we add more than one flavour, we'll need to update this
  // logic so the user is not prompted to choose a flavor if only one is
  // available.
  const automaticRedirectProduct = products[0];

  // Handle errors
  useEffect(() => {
    if (error) {
      throw error;
    }

    if (router.isReady && !uuid) {
      throw new Error("Missing dog profile UUID");
    }

    if (uuid && !data?.dogProfile && !loading) {
      throw new Error("Error loading dog profile data");
    }
  }, [data, error, loading, router, uuid]);

  // Handle automatic product selection
  useEffect(() => {
    if (automaticRedirectProduct) {
      router.prefetch(getRecommendationPathname(automaticRedirectProduct));
    }
  }, [automaticRedirectProduct, router]);

  useEffect(() => {
    if (automaticRedirectProduct && uuid && data?.dogProfile) {
      redirect(automaticRedirectProduct, "replace");
    }
  }, [data, automaticRedirectProduct, redirect, uuid]);

  return <PageSpinner label={t("common:loading")} />;
};

export default FoodPlanFlavorStep;

export const getStaticProps = makeStaticPropsGetter<FoodPlanFlavorStepProps>(
  async (_, { apolloClient }) => {
    const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");

    const handle = "food";

    const { data } = await runServerSideQuery<CollectionData>(apolloClient, {
      query: COLLECTION_BY_HANDLE,
      variables: { handle },
    });

    const products =
      data?.collection.products.edges.map(({ node }) => node) ?? null;

    if (!products || products.length < 1) {
      throw new Error(
        `Missing food products: "${handle}" collection did not include any available products`
      );
    }

    // Until we handle food selection, we'll throw an error if there is more
    // than one available product
    if (products.length > 1) {
      throw new Error("Cannot handle multiple food products");
    }

    return {
      props: {
        products,
      },
      revalidate: 5 * 60,
    };
  }
);
