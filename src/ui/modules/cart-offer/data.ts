import { captureException } from "@sentry/nextjs";
import { throwGraphQLErrors } from "@sss/apollo";
import { CoreOffer } from "@sss/ecommerce/offer/cart";
import {
  Product,
  PRODUCT_BY_HANDLE,
  ProductData,
} from "@sss/ecommerce/product";

import {
  makeStaticPropsGetter,
  StaticPropsGetter,
} from "../../../../pages/_app";

type PropGetterTransform = (
  result: {
    props: { products: Product[] };
    revalidate: number;
  },
  ...rest: Parameters<StaticPropsGetter>
) => ReturnType<StaticPropsGetter>;

export const makeCartOfferStaticPropsGetter = (
  offer: CoreOffer,
  transform: PropGetterTransform = async (result) => result
) =>
  makeStaticPropsGetter(async (context, common) => {
    try {
      // This is a little inefficient, but it doesn't matter too much with SWR
      const results = await Promise.all(
        offer.products.map((handle) =>
          common.apolloClient.query<ProductData>({
            fetchPolicy: "no-cache",
            query: PRODUCT_BY_HANDLE,
            variables: { handle },
          })
        )
      );
      throwGraphQLErrors(results);

      const products = results.map(({ data }) => {
        if (!data?.product) {
          throw new Error("Missing product data");
        }

        return data.product;
      });

      return transform(
        {
          props: { products },
          revalidate: 60,
        },
        context,
        common
      );
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        captureException(error, { extra: { offer } });

        return {
          redirect: { destination: "/checkout/information", permanent: false },
          revalidate: 60,
        };
      }

      throw error;
    }
  });
