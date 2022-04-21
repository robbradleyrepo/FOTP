import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import React from "react";

import {
  belt,
  gutter,
  gutterX,
  gutterY,
  mx,
  percentage,
  px,
  ratio,
  s,
  size,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import REVIEWS_MONTAGE_THUMBNAIL_IMG from "../../assets/images/reviews/MONTAGE_THUMBNAIL.jpg";
import OG_IMG from "../../assets/images/reviews/OPENGRAPH.jpg";
import type { ReviewsPageData } from "../../cms/reviews-page";
import { primaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import Spinner from "../../ui/base/spinner";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import VideoLauncher from "../../ui/base/video-launcher";
import ReviewsCarousel from "../../ui/modules/reviews/carousel";
import { ReviewsMainWidget } from "../../ui/modules/reviews/widgets";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  allReviews: {
    title: "All Customer Reviews",
  },
  header: {
    cta: "Watch {{ totalCount }} more stories",
    strapline:
      "Trusted by thousands of customers. Find out what our favorite pet parents are really saying about Front Of The Pack.",
    title: "Front Of The Pack customer reviews",
  },
  loadMore: "Load 5 more videos",
  meta: {
    description:
      "Real customer reviews | Rated “Excellent” | Trusted by thousands of customers | Find out what customers are really saying about Front Of The Pack Dog Supplements",
    openGraph: {
      description: "Real customer reviews | Rated “Excellent”",
      title: "Front Of The Pack Reviews | Rated “Excellent” By Owners",
    },
    title: "Front Of The Pack Reviews | Rated “Excellent” By Dog Owners",
  },
  selectedReviews: {
    cta: "Shop bestsellers",
    strapline: "Thousands of happy pups have benefited from Front Of The Pack",
    title: "What Our Customers Love",
  },
};

interface ReviewsPageProps {
  data: ReviewsPageData;
}

export const ReviewsPage: NextPageWithApollo<ReviewsPageProps> = ({ data }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ReviewsPage", enUsResource);

  const {
    reviewsPage: { reviews },
    videoTestimonials: { totalCount },
  } = data;

  return (
    <Standard>
      <Metadata
        description={t("ReviewsPage:meta.description")}
        title={t("ReviewsPage:meta.title")}
        openGraph={{
          description: t("ReviewsPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("ReviewsPage:meta.openGraph.title"),
        }}
      />
      <main id="main">
        <header
          css={s(gutterY, (t) => ({
            ...px([null, null, null, t.spacing.xl, t.spacing.xxl]),
            textAlign: "center",
          }))}
        >
          <Grid
            _css={s(belt)}
            gx={(t) => [null, null, null, t.spacing.xl, t.spacing.xxl]}
          >
            <Item
              _css={s({
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              })}
              width={[percentage(1), null, null, percentage(2 / 5)]}
            >
              <div
                css={s((t) => ({
                  ...px([t.spacing.md, null, 0]),
                  textAlign: ["center", null, null, "left"],
                }))}
              >
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                  }))}
                >
                  {t("ReviewsPage:header.title")}
                </h1>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    maxWidth: 700,
                    ...mx("auto"),
                  }))}
                >
                  {t("ReviewsPage:header.strapline")}
                </p>
                {totalCount !== "0" && (
                  <Link
                    css={s(primaryButton(), {
                      display: ["none", null, null, "inline-block"],
                    })}
                    to="/reviews/video-testimonials"
                  >
                    {t("ReviewsPage:header.cta", { totalCount })}
                  </Link>
                )}
              </div>
            </Item>
            <Item width={[percentage(1), null, null, percentage(3 / 5)]}>
              <VideoLauncher
                preload="none"
                src="https://player.vimeo.com/external/576748421.hd.mp4?s=c6e923145ab1134aa7c6a0759637f7d9f87a6b1b&profile_id=174"
                _css={s(ratio(9 / 16), { width: "100%" })}
              >
                {({ isBusy }) => (
                  <>
                    <ResponsiveImage
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      priority
                      sizes={{
                        maxWidth: [720, null, 640],
                        width: ["100vw", null, "50vw"],
                      }}
                      src={REVIEWS_MONTAGE_THUMBNAIL_IMG}
                    />
                    <div
                      css={s({
                        ...size([64, null, 72, 96]),
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        margin: "auto",
                        position: "absolute",
                      })}
                    >
                      <svg
                        css={s({
                          ...size([64, null, 72, 96]),
                          opacity: isBusy ? 0 : 0.9,
                          transition: "opacity 500ms",
                        })}
                        viewBox="0 0 102 102"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      >
                        <title>Play video</title>
                        <path
                          d="M51 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 51 0C22.8335 0 0 22.8335 0 51C0 79.1665 22.8335 102 51 102ZM41.4375 67.5627L70.125 51L41.4375 34.4373V67.5627Z"
                          fill="#fff"
                        />
                      </svg>
                      <Spinner
                        _css={s({
                          ...size("50%"),
                          opacity: isBusy ? 1 : 0,
                          transition: "opacity 500ms",
                        })}
                      />
                    </div>
                  </>
                )}
              </VideoLauncher>
              <div
                css={s(gutterX, (t) => ({
                  display: [null, null, null, "none"],
                  marginTop: t.spacing.lg,
                }))}
              >
                <Link css={s(primaryButton())} to="/reviews/video-testimonials">
                  {t("ReviewsPage:header.cta", { totalCount })}
                </Link>
              </div>
            </Item>
          </Grid>
        </header>

        {reviews && (
          <section
            css={s(gutterY, (t) => ({
              backgroundColor: t.color.background.feature1,
            }))}
          >
            <header
              css={s(gutterX, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
                textAlign: "center",
              }))}
            >
              <h2 css={s(headingAlpha)}>
                {t("ReviewsPage:selectedReviews.title")}
              </h2>
              <p css={s(bodyText, (t) => ({ marginTop: t.spacing.sm }))}>
                {t("ReviewsPage:selectedReviews.strapline")}
              </p>
            </header>
            <ReviewsCarousel reviews={reviews} />
            <div
              css={s(gutterX, (t) => ({
                marginTop: t.spacing.xl,
                textAlign: "center",
              }))}
            >
              <Link css={s(primaryButton())} to="/products">
                {t("ReviewsPage:selectedReviews.cta")}
              </Link>
            </div>
          </section>
        )}

        <section css={s(gutter, { textAlign: "center" })}>
          <div css={s(belt, { maxWidth: 1024 })}>
            <h2 css={s(headingAlpha)}>{t("ReviewsPage:allReviews.title")}</h2>
            <ReviewsMainWidget
              _css={s((t) => ({
                marginTop: [t.spacing.md, null, t.spacing.lg],
                minHeight: 1000,
              }))}
            />
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default ReviewsPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const REVIEWS_PAGE = (await import("../../cms/reviews-page")).REVIEWS_PAGE;
    const { data } = await runServerSideQuery<ReviewsPageData>(
      apolloClient,
      REVIEWS_PAGE
    );

    if (!data?.reviewsPage) {
      throw new Error("Unexpected missing review_page singleton type");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
