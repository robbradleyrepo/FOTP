import {
  NextPageWithApollo,
  runServerSideQuery,
  throwGraphQLErrors,
} from "@sss/apollo";
import { trackViewItemListEvent } from "@sss/ecommerce/analytics";
import { useCart } from "@sss/ecommerce/cart";
import type { Collection, CollectionData } from "@sss/ecommerce/collection";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React, { FC, useEffect } from "react";
import LazyAnimation from "src/ui/base/lazy-animation";

import {
  belt,
  ComponentStyleProps,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  gutterY,
  mx,
  px,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../pages/_app";
import PRODUCTS_HERO_IMG from "../assets/images/products/HERO.jpg";
import OG_IMG from "../assets/images/products/OPENGRAPH.jpg";
import type { ProductsPage, ProductsPageData } from "../cms/products-page";
import { Grid, Item } from "../ui/base/grid";
import ResponsiveImage from "../ui/base/responsive-image";
import { bodyText, headingAlpha, headingBravo } from "../ui/base/typography";
import { wave } from "../ui/base/wave";
import ProductListingItem from "../ui/modules/products/listing-item";
import ReviewsCarousel from "../ui/modules/reviews/carousel";
import Standard from "../ui/templates/standard";

const enUsResource = {
  meta: {
    description:
      "Trusted by thousands of dog owners, our vet-recommended dog supplements come with a 90 day guarantee & free shipping on all orders over {{ amount }} | Click for offers",
    openGraph: {
      description: "Trusted by thousands of dog owners. Made in America",
      title: "Shop Our Range Of Vet-Recommended Dog Supplements",
    },
    title: "Shop Our Range Of Vet-Recommended Dog Supplements | FOTP",
  },
  reviews: {
    title: "Over $t(common:happyPups) Happy Pups",
  },
  strapline:
    "Clinically-proven ingredients, in a range of daily supplements and tasty treats, guaranteed to make your pup thrive.",
  title: "Give Your Bestie a Natural Boost",
};

type ProductCollectionProps = Collection & ComponentStyleProps;

const ProductCollection: FC<ProductCollectionProps> = ({
  _css = {},
  description,
  products,
  title,
}) => (
  <section css={s(gutter, _css)}>
    <div css={s(belt)}>
      <header
        css={s((t) => ({
          ...mx("auto"),
          marginBottom: t.spacing.xl,
          textAlign: ["left", null, "center"],
        }))}
      >
        <h2 css={s(headingBravo)}>{title}</h2>
        <p
          css={s(bodyText, (t) => ({
            marginTop: t.spacing.sm,
          }))}
        >
          {description}
        </p>
      </header>
      <Grid
        _css={s(belt, { maxWidth: 900 })}
        itemWidth={["100%", "50%"]}
        gx={(t) => [t.spacing.sm, t.spacing.md, t.spacing.xl, t.spacing.md]}
        gy={(t) => [t.spacing.xl, t.spacing.xxl]}
      >
        {products.edges.map(({ node }, position) => (
          <Item key={node.id}>
            <ProductListingItem
              _css={s({ height: "100%" })}
              collectionName={title}
              position={position}
              product={node}
              sizes={{
                maxWidth: 1280 / 3,
                width: ["100vw", "50vw", "33.333vw"],
              }}
            />
          </Item>
        ))}
      </Grid>
    </div>
  </section>
);

interface ProductsProps {
  cms: ProductsPage;
  supplements: CollectionData;
  treats?: CollectionData;
}

export const Products: NextPageWithApollo<ProductsProps> = ({
  cms,
  supplements,
  treats,
}) => {
  const { shippingThreshold } = useCart();
  const formatCurrency = useCurrencyFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "products", enUsResource);

  useEffect(() => {
    trackViewItemListEvent(
      supplements.collection.products.edges.map(({ node }) => node),
      supplements.collection.title
    );

    if (treats) {
      trackViewItemListEvent(
        treats.collection.products.edges.map(({ node }) => node),
        treats.collection.title
      );
    }
  }, [supplements, treats]);

  return (
    <Standard>
      <Metadata
        description={t("products:meta.description", {
          amount:
            shippingThreshold &&
            formatCurrency({
              ...shippingThreshold,
              fractionDigits: 0,
            }),
        })}
        title={t("products:meta.title")}
        openGraph={{
          description: t("products:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("products:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutterBottom, gutterX, (t) => ({
            color: t.color.text.light.base,
            paddingTop: ["30%", null, 96, t.spacing.xxxl],
            position: "relative",
          }))}
        >
          <div css={s(belt)}>
            <div
              css={s({
                maxWidth: 400,
                ...mx(["auto", null, 0]),
                textAlign: ["center", null, "left"],
              })}
            >
              <LazyAnimation>
                <h1 css={s(headingAlpha)}>{t("products:title")}</h1>
                <p css={s(bodyText, (t) => ({ marginTop: t.spacing.sm }))}>
                  {t("products:strapline")}
                </p>
              </LazyAnimation>
            </div>
          </div>
          <div
            css={s(greedy, (t) => ({
              backgroundColor: t.color.background.dark,
              zIndex: -1,
            }))}
          >
            <ResponsiveImage
              alt=""
              src={PRODUCTS_HERO_IMG}
              layout="fill"
              objectFit="cover"
              priority
              sizes={{ width: ["200vw", null, "100vw"] }}
            />
            <div
              css={s(greedy, {
                backgroundImage: [
                  "linear-gradient(0deg, rgba(3, 36, 26, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
                  null,
                  "linear-gradient(90deg, rgba(3, 36, 26, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
                ],
              })}
            />
          </div>
        </header>

        <ProductCollection {...supplements.collection} />
        {treats && (
          <ProductCollection
            {...treats.collection}
            _css={s({ paddingTop: 0 })}
          />
        )}

        {cms.reviews && (
          <section
            css={s(gutterY, (t) => ({
              "&:before": {
                ...wave({ color: t.color.background.feature1 }),
                bottom: "100%",
                content: "''",
                display: "block",
                left: 0,
                position: "absolute",
                right: 0,
              },
              backgroundColor: t.color.background.feature1,
              position: "relative",
              ...px([null, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
            }))}
          >
            <h2
              css={s(gutterX, headingAlpha, (t) => ({
                marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                textAlign: "center",
              }))}
            >
              {t("products:reviews.title")}
            </h2>
            <ReviewsCarousel reviews={cms.reviews} />
          </section>
        )}
      </main>
    </Standard>
  );
};

export default Products;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const PRODUCTS_PAGE = (await import("../cms/products-page")).PRODUCTS_PAGE;
    const COLLECTION_BY_HANDLE = (await import("@sss/ecommerce/collection"))
      .COLLECTION_BY_HANDLE;

    const productsPage = await runServerSideQuery<ProductsPageData>(
      apolloClient,
      PRODUCTS_PAGE
    );

    const [supplements, treats] = await Promise.all(
      ["supplements", "treats"].map((handle) =>
        apolloClient.query<CollectionData | { collection: null }>({
          fetchPolicy: "no-cache",
          query: COLLECTION_BY_HANDLE,
          variables: {
            handle,
          },
        })
      )
    );
    throwGraphQLErrors(
      [supplements, treats],
      "Failed to fetch Products collection data"
    );

    if (
      !productsPage.data.productsPage ||
      !supplements.data.collection ||
      !treats.data.collection
    ) {
      throw new Error(
        "Products page data is unexpectedly missing from the API response"
      );
    }

    const props: ProductsProps = {
      cms: productsPage.data.productsPage,
      supplements: supplements.data,
      treats: treats.data,
    };

    return {
      props,
      revalidate: 60,
    };
  }
);
