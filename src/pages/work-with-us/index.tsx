import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import React from "react";
import { Trans } from "react-i18next";
import { primaryButton } from "src/ui/base/button";
import Hero from "src/ui/base/hero";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, greedy, gutter, percentage, px, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import HEADER_TRANS_IMG from "../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../assets/images/science/HEADER_TRANS_MOBILE.png";
import LEAF_IMG from "../../assets/images/sustainability/LEAF.jpg";
import AFFILIATES_IMG from "../../assets/images/work-with-us/AFFILIATES.jpg";
import CAREERS_IMG from "../../assets/images/work-with-us/CAREERS.jpg";
import INFLUENCERS_IMG from "../../assets/images/work-with-us/INFLUENCERS.jpg";
import REFER_IMG from "../../assets/images/work-with-us/REFER.jpg";
import { Grid, Item } from "../../ui/base/grid";
import LazyAnimation from "../../ui/base/lazy-animation";
import {
  bodyText,
  headingAlpha,
  headingBravo,
  textLink,
} from "../../ui/base/typography";
import { spacing } from "../../ui/styles/variables";
import Standard from "../../ui/templates/standard";
const enUsResource = {
  affiliates: {
    cta: "Become an Affiliate",
    link: "http://app.impact.com/advertiser-advertiser-info/FOTP-US-Inc.brand",
    text:
      "If you are an active affiliate and would like to join our program, head on over to our partnership page on Impact. You’ll find all the details you need there.",
    title: "Affiliates",
  },
  careers: {
    cta: "Join The Pack",
    text:
      "Our team is growing and we’re always looking for passionate, dedicated dog lovers to come join us. Click the button below to see if we’ve got open roles we’re looking to hire. If not, email us at <Email>$t(common:email)</Email> and tell us how you want to work with us.",
    title: "Careers",
  },
  contact: {
    text:
      "Can’t find what you are looking for? <br/>Send us an email at <Email>$t(common:email)</Email> and<br/>one of our team will get back to you.",
    title: "Come Join The Pack",
  },
  header: {
    text:
      "Together we can change dog’s lives across the nation with better food, nutrition and shelter. Check out how you can be part of the Pack.",
    title: "Come Join The Pack",
  },
  influencers: {
    cta: "Become an Influencer",
    text:
      "Are you an influencer? Do you love dogs? Do you love our products? Then apply to join our influencer program today to see how you can join us and make a difference to the health and wellbeing of even more dogs. ",
    title: "Influencers",
  },
  meta: {
    description:
      "Our team is growing and we’re always looking for passionate, dedicated dog lovers to come join us.",
    openGraph: {
      description:
        "Our team is growing and we’re always looking for passionate, dedicated dog lovers to come join us.",
      title: "Check out how you can be part of the Pack.",
    },
    title: "Check out how you can be part of the Pack. | FOTP",
  },
  refer: {
    cta: "Refer a Friend",
    text:
      "Why not share the love and get store credit at the same time! Sign up to our referral program today and get store credit for everyone who uses your unique link. Plus, they’ll get money off their first order too.",
    title: "Refer a Friend - Give $20, Get $20",
  },
};

export const WorkWithUsPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "workwithusPage", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("workwithusPage:meta.description")}
        title={t("workwithusPage:meta.title")}
        openGraph={{
          description: t("workwithusPage:meta.openGraph.description"),
          image: CAREERS_IMG.src,
          title: t("workwithusPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature1,
            height: ["auto", null, "100vh"],
            marginBottom: [0, null, 96, t.spacing.xxxl],
            maxHeight: ["none", null, 360, 400],
            position: "relative",
            ...py([140, null, 0]),
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "cover",
                objectPosition: ["center center", null, null],
              },
              zIndex: 1,
            })}
            priority
            quality={60}
            urls={[HEADER_TRANS_MOBILE_IMG.src, null, HEADER_TRANS_IMG.src]}
          />
          <div
            css={s(belt, {
              alignItems: "center",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              maxWidth: 820,
              textAlign: "center",
            })}
          >
            <div>
              <h1
                css={s((t) => ({
                  fontFamily: t.font.secondary.family,
                  fontSize: [16],
                  fontStyle: "italic",
                  letterSpacing: "0.25em",
                  marginBottom: [t.spacing.sm, null, t.spacing.md],
                  textTransform: "uppercase",
                }))}
              >
                {t("workwithusPage:header.title")}
              </h1>
              <p css={s(headingBravo)}>{t("workwithusPage:header.text")}</p>
            </div>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
              gx={spacing.sm}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      maxWidth: [null, null, 632],
                      width: ["100vw", null, "50vw"],
                    }}
                    src={CAREERS_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: ["center", null, "flex-start"],
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("workwithusPage:careers.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      <Trans
                        components={{
                          Email: (
                            <a
                              css={s(textLink)}
                              href={`mailto:${t("common:email")}`}
                            />
                          ),
                        }}
                        i18nKey="workwithusPage:careers.text"
                      />
                    </p>
                    <a
                      css={s(primaryButton(), (t) => ({
                        position: "relative",
                        ...px([t.spacing.lg, t.spacing.xl]),
                      }))}
                      href="https://apply.workable.com/front-of-the-pack/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("workwithusPage:careers.cta")}
                    </a>
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            paddingTop: 0,
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              gy={spacing.lg}
              gx={spacing.sm}
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      maxWidth: [null, null, 632],
                      width: ["100vw", null, "50vw"],
                    }}
                    src={REFER_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <Trans i18nKey="workwithusPage:refer.title" />
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("workwithusPage:refer.text")}
                    </p>
                    <Link
                      css={s(primaryButton(), (t) => ({
                        ...px([t.spacing.lg, t.spacing.xl]),
                      }))}
                      to="/work-with-us/refer"
                    >
                      {t("workwithusPage:refer.cta")}
                    </Link>
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            paddingTop: 0,
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
              gx={spacing.sm}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      maxWidth: [null, null, 632],
                      width: ["100vw", null, "50vw"],
                    }}
                    src={INFLUENCERS_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: ["center", null, "flex-start"],
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("workwithusPage:influencers.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("workwithusPage:influencers.text")}
                    </p>
                    <Link
                      css={s(primaryButton(), (t) => ({
                        ...px([t.spacing.lg, t.spacing.xl]),
                      }))}
                      to="/work-with-us/influencer"
                    >
                      {t("workwithusPage:influencers.cta")}
                    </Link>
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, (t) => ({
            ...px([t.spacing.md, null, 0]),
            paddingTop: 0,
          }))}
        >
          <div css={s(belt)}>
            <Grid
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
              gy={spacing.lg}
              gx={spacing.sm}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{
                      maxWidth: [null, null, 632],
                      width: ["100vw", null, "50vw"],
                    }}
                    src={AFFILIATES_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                })}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 540,
                    ...px([0, null, t.spacing.xl]),
                    ...py([0, null, null, t.spacing.xxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <Trans i18nKey="workwithusPage:affiliates.title" />
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.md,
                      }))}
                    >
                      {t("workwithusPage:affiliates.text")}
                    </p>
                    <a
                      css={s(primaryButton(), (t) => ({
                        position: "relative",
                        ...px([t.spacing.lg, t.spacing.xl]),
                      }))}
                      href="http://app.impact.com/advertiser-advertiser-info/FOTP-US-Inc.brand"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("workwithusPage:affiliates.cta")}
                    </a>
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>

        <section
          css={s(gutter, {
            ...py([96, null, 120, 140]),
            textAlign: "center",
          })}
        >
          <div css={s(belt, { margin: "0 auto", maxWidth: 560 })}>
            <LazyAnimation>
              <div
                css={s({
                  margin: "auto",
                  maxWidth: [64, null, 128],
                })}
              >
                <ResponsiveImage
                  alt=""
                  sizes={{
                    width: "100vw",
                  }}
                  src={LEAF_IMG}
                />
              </div>
            </LazyAnimation>
            <LazyAnimation>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginTop: t.spacing.sm,
                  paddingBottom: t.spacing.md,
                }))}
              >
                {t("workwithusPage:contact.title")}
              </h2>
              <p
                css={s(bodyText, (t) => ({
                  fontSize: 16,
                  marginBottom: t.spacing.md,
                }))}
              >
                <Trans
                  components={{
                    Email: (
                      <a
                        css={s(textLink)}
                        href={`mailto:${t("common:email")}`}
                      />
                    ),
                  }}
                  i18nKey="workwithusPage:contact.text"
                />
              </p>
            </LazyAnimation>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default WorkWithUsPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
