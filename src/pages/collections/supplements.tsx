import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import type { CollectionData } from "@sss/ecommerce/collection";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import React from "react";
import { primaryButton } from "src/ui/base/button";
import LazyAnimation from "src/ui/base/lazy-animation";
import ResponsiveImage from "src/ui/base/responsive-image";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  mx,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import HERO_DESKTOP_IMG from "../../assets/images/collections/supp-hero-desktop.jpg";
import HERO_MOB_IMG from "../../assets/images/collections/supp-hero-mob.jpg";
import HERO_TABLET_IMG from "../../assets/images/collections/supp-hero-tablet.jpg";
import OG_IMG from "../../assets/images/collections/supp-og.png";
import TREATS_IMG from "../../assets/images/collections/treats-block.jpg";
import { Grid, Item } from "../../ui/base/grid";
import Hero from "../../ui/base/hero";
import { bodyTextStatic, headingAlpha } from "../../ui/base/typography";
import ProductListingItem from "../../ui/modules/products/listing-item";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  header: {
    copy:
      "We’ve combined a pure powder format with clinically-proven ingredients, in a range of tasty daily supplements.",
    title: "supplements",
  },
  meta: {
    openGraph: {
      title: "{{ title }} | Front Of The Pack",
    },
    title: "{{ title }} | Front Of The Pack",
  },
  treats: {
    copy:
      "Prepared from pure, raw, proteins. Freeze-Dried using a slow 48-hour process that locks in the vital nutrients without cooking the food.",
    cta: "Shop treats",
    title: "New Freeze-Dried Guilt Free Treats",
  },
};

interface SupplementsPageProps {
  data: CollectionData;
}

const SupplementsPage: NextPageWithApollo<SupplementsPageProps> = ({
  data,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "supplements", enUsResource);

  const {
    collection: { description, products, title },
  } = data;

  return (
    <Standard>
      <Metadata
        description={description}
        title={t("supplements:meta.title", { title })}
        openGraph={{
          description: description,
          image: OG_IMG.src,
          title: t("supplements:meta.title", { title }),
        }}
      />

      <main>
        {/* header */}
        <header
          css={s({
            height: [528, null, "50vw", 500],
            position: "relative",
            width: "auto",
          })}
        >
          <Hero
            _css={s(greedy, {
              "& > *": { ...greedy, objectFit: "cover" },
              zIndex: -1,
            })}
            priority
            quality={60}
            urls={[
              HERO_MOB_IMG.src,
              null,
              HERO_TABLET_IMG.src,
              HERO_DESKTOP_IMG.src,
            ]}
          />
          {/* content */}
          <div
            css={s(belt, gutterX, greedy, {
              alignItems: ["flex-start", null, null, "center"],
              display: "flex",
              justifyContent: ["center", null, "flex-start"],
              textAlign: ["center", null, "left"],
            })}
          >
            <div css={s({ maxWidth: [500, null, 300, 500] })}>
              <LazyAnimation>
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.md],
                    marginTop: [t.spacing.xl, null, "10vw", 0],
                  }))}
                >
                  {title}
                </h1>
                <p css={s(bodyTextStatic)}>{description}</p>
              </LazyAnimation>
            </div>
          </div>
        </header>
        {/* products */}
        <section css={s(gutter)}>
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
                    maxWidth: [900, 900 / 2],
                    width: ["100vw", "50vw"],
                  }}
                />
              </Item>
            ))}
          </Grid>
        </section>

        {/* content block */}
        <LazyAnimation>
          <section css={s(gutterBottom)}>
            <Grid
              direction={"rtl"}
              gx={(t) => t.spacing.lg}
              gy={(t) => t.spacing.xl}
              itemWidth={["100%", null, "50%"]}
            >
              <Item>
                <div
                  css={s({
                    display: ["none", null, "block"],
                    height: [null, null, 500, 669],
                    position: "relative",
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes={{
                      width: ["100vw", null, "50vw"],
                    }}
                    src={TREATS_IMG}
                  />
                </div>
                <div css={s({ display: [null, null, "none"] })}>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      width: ["100vw", null, "50vw"],
                    }}
                    src={TREATS_IMG}
                  />
                </div>
              </Item>
              <Item
                _css={s({
                  alignItems: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                  textAlign: "left",
                })}
              >
                <div
                  css={s((t) => ({
                    margin: "auto",
                    maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                    paddingLeft: [
                      t.spacing.md,
                      t.spacing.xl,
                      null,
                      t.spacing.xxl,
                      t.spacing.xxxl,
                    ],
                    paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                    width: "100%",
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: t.spacing.md,
                      textAlign: "left",
                    }))}
                  >
                    {t("supplements:treats.title")}
                  </h2>
                  <p
                    css={s(bodyTextStatic, (t) => ({
                      marginBottom: t.spacing.md,
                    }))}
                  >
                    {t("supplements:treats.copy")}
                  </p>
                  <Link
                    css={s(primaryButton(), {
                      ...mx(["auto", null, 0]),
                    })}
                    to="/collections/treats"
                  >
                    {t("supplements:treats.cta")}
                  </Link>
                </div>
              </Item>
            </Grid>
          </section>
        </LazyAnimation>
      </main>
    </Standard>
  );
};

export default SupplementsPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const handle = "supplements";
    const { COLLECTION_BY_HANDLE } = await import("@sss/ecommerce/collection");
    const { data } = await runServerSideQuery<CollectionData>(apolloClient, {
      query: COLLECTION_BY_HANDLE,
      variables: {
        first: 10,
        handle,
      },
    });

    if (!data?.collection) {
      throw new Error(`Unexpected missing '${handle}' collection`);
    }

    return {
      props: { data },
      revalidate: 60,
    };
  }
);
