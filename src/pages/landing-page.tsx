import { dataLayerTrack } from "@sss/analytics";
import {
  initializeApollo,
  NextPageWithApollo,
  runServerSideQuery,
} from "@sss/apollo";
import { getFetchedImageUrl } from "@sss/cloudinary";
import type { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { linkResolver } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { subDays } from "date-fns";
import { GetStaticPaths } from "next";
import React, { useEffect } from "react";

import { s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../pages/_app";
import {
  LandingPageData,
  LandingPageHeaderPublicationDateType,
  LandingPageSummaryData,
} from "../cms/landing-page";
import { ProductDataProvider } from "../cms/landing-page";
import {
  CtaClickEventHandler,
  LandingPageSliceZone,
} from "../cms/landing-page/slices";
import { I18N } from "../config";
import Footer from "../ui/modules/footer";
import Layout from "../ui/modules/landing-page/layout";
import LegalBanner from "../ui/modules/landing-page/legal-banner";
import LegalDisclaimer from "../ui/modules/landing-page/legal-disclaimer";
import Nav from "../ui/modules/landing-page/nav";

const enUsResource = {
  meta: {
    description:
      "No fillers or nasties. Just a pure powder blend of clinically-proven ingredients that actually work.",
    title: "We've reinvented dog supplements",
  },
};

interface LandingPageProps {
  handle: string;
  data: {
    cms: LandingPageData;
    ecommerce: Product | null;
    generated: {
      publicationDate: string | null;
    };
  };
}

export const LandingPage: NextPageWithApollo<LandingPageProps> = ({
  handle,
  data,
}) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "landingPage", enUsResource);

  const { cms, ecommerce } = data;
  const {
    body,
    headerImage,
    headerImageHero,
    legalBannerEnabled,
    legalDisclaimer,
    navEnabled,
    seoDescription,
    seoTitle,
    socialMediaDescription,
    socialMediaImage,
    socialMediaTitle,
  } = cms.landingPage;

  const title = seoTitle ?? t("landingPage:meta.title");

  let openGraphImage =
    socialMediaImage?.url ?? headerImageHero?.url ?? headerImage?.url;

  if (openGraphImage) {
    openGraphImage = getFetchedImageUrl({ url: openGraphImage, width: 1200 });
  }

  const handleCtaClick: CtaClickEventHandler = ({ link, text, type }) => {
    try {
      let href = link && linkResolver(link);

      if (href && href.startsWith("/")) {
        href = `${process.env.ORIGIN}${href}`;
      }
      dataLayerTrack({
        event: "landing_page_clicked",
        handle,
        href,
        label: text,
        title,
        type,
      });
    } catch (error) {
      // Fail silently
    }
  };

  useEffect(() => {
    dataLayerTrack({
      event: "landing_page_viewed",
      handle,
      title,
    });
  }, [handle, title]);

  return (
    <ProductDataProvider cms={cms.landingPage.product} ecommerce={ecommerce}>
      <Metadata
        description={seoDescription ?? t("landingPage:meta.description")}
        noindex
        openGraph={{
          description: socialMediaDescription ?? seoDescription,
          image: openGraphImage,
          title: socialMediaTitle ?? seoTitle,
        }}
        title={title}
      />
      {navEnabled && <Nav {...data.cms.landingPage} />}
      <main
        css={s((t) => ({
          paddingBottom: t.spacing.xxl,
          paddingTop: navEnabled
            ? [t.height.nav.mobile, null, t.height.nav.desktop]
            : null,
        }))}
      >
        {legalBannerEnabled && <LegalBanner />}

        <Layout
          onCtaClick={handleCtaClick}
          {...data.cms.landingPage}
          publicationDate={data.generated.publicationDate}
        >
          <LandingPageSliceZone onCtaClick={handleCtaClick} slices={body} />
        </Layout>
      </main>
      {legalDisclaimer && <LegalDisclaimer body={legalDisclaimer} />}
      <Footer />
    </ProductDataProvider>
  );
};

export default LandingPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const locale = I18N.fallbackLocale;

  const client = initializeApollo({});

  const { LANDING_PAGES } = await import("../cms/landing-page");

  const { data } = await client.query<LandingPageSummaryData>({
    fetchPolicy: "no-cache",
    query: LANDING_PAGES,
    variables: {
      first: 1,
    },
  });

  return {
    fallback: "blocking",
    paths: data.landingPages.edges.map(({ node: { _meta: { uid } } }) => ({
      params: { handle: uid, language: locale.language, region: locale.region },
    })),
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    if (!params?.handle) {
      throw new Error('Missing param "handle"');
    }

    const { LANDING_PAGE } = await import("../cms/landing-page");
    const { data: cms } = await runServerSideQuery<LandingPageData>(
      apolloClient,
      {
        query: LANDING_PAGE,
        variables: { handle: params.handle },
      }
    );

    if (!cms?.landingPage) {
      return { notFound: true };
    }

    let ecommerce: Product | null = null;
    const shopifyProductHandle = cms.landingPage.product?._meta.uid;
    if (shopifyProductHandle) {
      const PRODUCT_BY_HANDLE = (await import("@sss/ecommerce/product"))
        .PRODUCT_BY_HANDLE;

      const result = await runServerSideQuery<{
        product: Product | null;
      }>(apolloClient, {
        query: PRODUCT_BY_HANDLE,
        variables: { handle: shopifyProductHandle },
      });

      ecommerce = result.data.product;
    }

    return {
      props: {
        data: {
          cms,
          ecommerce,
          generated: {
            publicationDate:
              cms.landingPage.headerPublicationDate ===
              LandingPageHeaderPublicationDateType.YESTERDAY
                ? subDays(new Date(), 1).toISOString()
                : null,
          },
        },
        handle: params.handle,
      },
      revalidate: 60,
    };
  }
);
