import { runServerSideQuery } from "@sss/apollo";
import type { CollectionData } from "@sss/ecommerce/collection";
import type { Connection } from "@sss/ecommerce/common";
import type { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import {
  belt,
  gutter,
  gutterTop,
  gutterX,
  link,
  percentage,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import OG_IMG from "../../assets/images/products/OPENGRAPH.jpg";
import { Grid, Item } from "../../ui/base/grid";
import {
  bodyText,
  headingAlpha,
  headingCharlie,
  textLink,
} from "../../ui/base/typography";
import ProductListingItem, {
  ProductListingItemLayoutType,
} from "../../ui/modules/products/listing-item";
import SocialIcons from "../../ui/modules/social-icons";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  meta: {
    description:
      "Find all of the information you’ll ever need about our dog supplements. Including ingredients, serving guides and other frequently asked questions.",
    openGraph: {
      description:
        "Find all of the information you’ll ever need about our dog supplements. Including ingredients, serving guides and other frequently asked questions.",
      title:
        "All Of The Information You’ll Ever Need About Our Dog Supplements",
    },
    title: "All Of The Information You’ll Ever Need About Our Dog Supplements",
  },
  products: {
    title: "Select a product for more info",
  },
  questions: {
    description: `<Paragraph>Use the help widget to send a message directly to the team, or contact us at:</Paragraph>
    <Paragraph><Email>$t(common:email)</Email>  or  <Phone>323-922-5737</Phone></Paragraph>
    <Paragraph>If you can't see a help icon in the bottom right of your browser, you may have ad-blocking software enabled that prevents it from showing up. If you wish to get in touch via chat you might need to disable your ad-blocker.</Paragraph>
    <Paragraph>You can also contact us via our social media accounts:</Paragraph>`,
    title: "More Questions?<br />We're here to help!",
  },
  strapline:
    "Here you can find all of the information you’ll ever need about our products. Including ingredients, serving guides and other frequently asked questions.",
  title: "Product Information",
};

interface ProductInformationListingPageProps {
  products: Connection<Product>;
}

export const ProductInformationListingPage: FC<ProductInformationListingPageProps> = ({
  products,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "ProductInformationListingPage",
    enUsResource
  );

  return (
    <Standard>
      <Metadata
        description={t("ProductInformationListingPage:meta.description")}
        title={t("ProductInformationListingPage:meta.title")}
        openGraph={{
          description: t(
            "ProductInformationListingPage:meta.openGraph.description"
          ),
          image: OG_IMG.src,
          title: t("ProductInformationListingPage:meta.openGraph.title"),
        }}
      />
      <main css={s({ textAlign: "center" })}>
        <header css={s(gutterTop, gutterX)}>
          <div css={s(belt, { maxWidth: 720 })}>
            <h1 css={s(headingAlpha)}>
              {t("ProductInformationListingPage:title")}
            </h1>
            <p css={s(bodyText, (t) => ({ marginTop: t.spacing.md }))}>
              {t("ProductInformationListingPage:strapline")}
            </p>
          </div>
        </header>
        <section css={s(gutter)}>
          <div css={s(belt)}>
            <header
              css={s((t) => ({
                marginBottom: t.spacing.xl,
              }))}
            >
              <h2 css={s(headingCharlie)}>
                {t("ProductInformationListingPage:products.title")}
              </h2>
            </header>
            <Grid
              gx={(t) => [
                t.spacing.md,
                null,
                t.spacing.md,
                t.spacing.lg,
                t.spacing.xl,
              ]}
              gy={(t) => t.spacing.xl}
              itemWidth={[percentage(1), percentage(1 / 2), percentage(1 / 3)]}
            >
              {products.edges.map(({ node }, position) => (
                <Item key={node.id}>
                  <ProductListingItem
                    _css={s({ height: "100%" })}
                    layout={ProductListingItemLayoutType.MINIMAL}
                    position={position}
                    product={node}
                    sizes={{
                      maxWidth: 1280 / 3,
                      width: ["100vw", "50vw", "33.333vw"],
                    }}
                    to={`/info/${node.handle}`}
                    trackingEnabled={false}
                  />
                </Item>
              ))}
            </Grid>
          </div>
        </section>
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
          }))}
        >
          <div css={s(bodyText, belt, { maxWidth: 680 })}>
            <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.lg }))}>
              <Trans i18nKey="ProductInformationListingPage:questions.title" />
            </h2>
            <Trans
              components={{
                Email: (
                  <a
                    css={s(textLink, link)}
                    href={`mailto:${t("common:email")}`}
                  />
                ),
                Paragraph: (
                  <p css={s((t) => ({ marginBottom: t.spacing.md }))} />
                ),
                Phone: <a css={s(textLink, link)} href="tel:+13239225737" />,
              }}
              i18nKey="ProductInformationListingPage:questions.description"
            />
            <SocialIcons />
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default ProductInformationListingPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const handle = "product-information";
    const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");

    const { data } = await runServerSideQuery<CollectionData>(apolloClient, {
      query: COLLECTION_BY_HANDLE,
      variables: {
        handle,
      },
    });

    if (!data?.collection.products) {
      throw new Error(`Failed to fetch "${handle}" collection`);
    }

    return {
      props: { products: data.collection.products },
      revalidate: 5 * 60,
    };
  }
);
