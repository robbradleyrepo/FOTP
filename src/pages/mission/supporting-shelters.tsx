import { CloudinaryUploadedAnimation } from "@sss/cloudinary";
import { useTimedLoop } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Metadata } from "@sss/seo";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Trans } from "react-i18next";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, percentage, px, py, ratio, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import APP_STORE_IMG from "../../assets/images/shelters/APP_STORE.png";
import HERO_IMG from "../../assets/images/shelters/HERO.jpg";
import OG_IMG from "../../assets/images/shelters/OPENGRAPH.jpg";
import PLAY_STORE_IMG from "../../assets/images/shelters/PLAY_STORE.png";
import RESQWALK_IMG from "../../assets/images/shelters/RESQWALK.jpg";
import STEP1_IMG from "../../assets/images/shelters/STEP_1.png";
import STEP2_IMG from "../../assets/images/shelters/STEP_2.png";
import STEP3_IMG from "../../assets/images/shelters/STEP_3.png";
import STEP4_IMG from "../../assets/images/shelters/STEP_4.png";
import { primaryButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import Icon from "../../ui/base/icon";
import LazyAnimation from "../../ui/base/lazy-animation";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingCharlie,
} from "../../ui/base/typography";
import paw from "../../ui/icons/paw";
import pawPrints from "../../ui/icons/pawPrints";
import { dataUriFromPath } from "../../ui/styles/utils";
import { color, spacing } from "../../ui/styles/variables";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  give: {
    calvin:
      "When it comes to soft, squishy and sweet, Calvin gives marshmallows a run for their money.",
    cta: "Shop now and give",
    dorian:
      "Dorian is the class clown, clever learner and cuddle buddy all rolled into one.",
    drusilla:
      "Not a stretch to say that this tiny dachshund with the giant grin is fiercely cute.",
    kit:
      "Kit came to Best Friends in 2016 after they were found on the side of the road.",
    pudge: "From Pudge’s perspective, the world is a pretty awesome place.",
    raquel:
      "A smart girl who is always eager to learn more, Raquel is a fun and lively dog.",
    text:
      "Every pet has a story, each one worth saving, each life individual and important. It’ll take everyone working together to bring the nation to no-kill by 2025. We need kind hearted people like you to help save the lives of the nations shelter dogs.",
    title: "Together we can<br /> save them all.",
  },
  header: {
    description:
      "We’re proud to partner with Best Friends Animal Society and commit to making the nation’s shelters no-kill by 2025.",
    title: "Let’s make history, together.",
  },
  how: {
    item1: {
      text: "Simply shop your favorite dog supplements",
      title: "Add to cart",
    },
    item2: {
      text: "At checkout, select your local no-kill shelter",
      title: "Select a shelter",
    },
    item3: {
      text: "Complete your purchase and we’ll send 1% to the shelter",
      title: "Auto-donate",
    },
    item4: {
      text: "Continue supporting your shelter with every walk!",
      title: "Download ResQWalk",
    },
    title: "How you can help",
  },
  meta: {
    description:
      "Every pet has a story, each one worth saving. That's why we've partnered with Best Friends Animal Society. We're on a mission to make America “No Kill” by 2025.",
    openGraph: {
      description: "We've partnered with Best Friends Animal Society",
      title: "You Shop - We Give. Help Save A Shelter Dog Today",
    },
    title: "You Shop - We Give. Help Save A Shelter Dog Today | FOTP",
  },
  resqwalk: {
    footnote:
      "Front Of The Pack are the official sponsors of ResQWalk and provide a pool of cash each month. Each shelter earns a proportion of this pool according to how many miles have been walked for them.",
    item1: "Download the app",
    item2: "Select your shelter",
    item3: "Walk your dog and donate!",
    text:
      "ResQWalk is a free mobile app that lets you raise money for your shelter with every walk! It’s as easy as 1, 2, 3:",
    title: "Raise money with every walk.",
  },
};

const shelterDogs = [
  {
    key: "dorian",
    publicId: "/shelters/DORIAN",
    version: "v1606478903",
  },
  {
    key: "drusilla",
    publicId: "/shelters/DRUSILLA",
    version: "v1606478903",
  },
  {
    key: "raquel",
    publicId: "/shelters/RAQUEL",
    version: "v1606478903",
  },
  {
    key: "kit",
    publicId: "/shelters/KIT",
    version: "v1606478903",
  },
  {
    key: "calvin",
    publicId: "/shelters/CALVIN",
    version: "v1606478903",
  },
  {
    key: "pudge",
    publicId: "/shelters/PUDGE",
    version: "v1606478903",
  },
];

const featureUnorderedListItem = s(bodyText, (t) => ({
  "&:before": {
    content: `url(${dataUriFromPath({
      fill: color.tint.pistachio,
      path: paw,
    })})`,
    display: "block",
    height: "1.2em",
    left: 0,
    position: "absolute",
    top: 2,
    transform: "rotate(-30deg)",
    width: "1.2em",
  },

  "&:nth-cild(even):before": {
    transform: "rotate(30deg)",
  },
  fontSize: 16,
  marginTop: t.spacing.sm,
  paddingLeft: "2em",
  position: "relative",
  textAlign: "left",
}));

export const SheltersPage = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "shelterPage", enUsResource);

  const currentShelterImage = useTimedLoop([0, 1, 2, 3, 4, 5], 5000);

  return (
    <Standard>
      <Metadata
        description={t("shelterPage:meta.description")}
        title={t("shelterPage:meta.title")}
        openGraph={{
          description: t("shelterPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("shelterPage:meta.openGraph.title"),
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            paddingBottom: 0,
            paddingTop: t.spacing.xl,
            ...px([t.spacing.md, null, 0]),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              gy={spacing.xl}
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
            >
              <Item
                _css={s({
                  alignItems: "flex-start",
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
                    paddingBottom: [0, null, t.spacing.xxl, 240],
                    paddingTop: [0, null, t.spacing.xl, t.spacing.xxxl],
                  }))}
                >
                  <LazyAnimation>
                    <h1
                      css={s(headingAlpha, (t) => ({
                        fontSize: [48, null, 56, 64, 72],
                        lineHeight: "1.1em",
                        margin: "0 auto",
                        maxWidth: ["none", null, 500, 800],
                        paddingBottom: [t.spacing.md, null, t.spacing.lg],
                      }))}
                    >
                      <Trans i18nKey="shelterPage:header.title" />
                    </h1>
                    <p
                      css={s(bodyText, {
                        fontSize: [18, null, 20],
                        margin: "0 auto",
                        maxWidth: ["none", null, 500, 600],
                      })}
                    >
                      {t("shelterPage:header.description")}
                    </p>
                  </LazyAnimation>
                </div>
              </Item>
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={HERO_IMG}
                  />
                </LazyAnimation>
              </Item>
            </Grid>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            "&:before": {
              backfaceVisibility: "hidden",
              backgroundColor: t.color.tint.peppermint,
              bottom: [-t.spacing.xxl, null, null, -t.spacing.xxxl],
              content: "''",
              left: 0,
              position: "absolute",
              right: 0,
              top: [-t.spacing.xxl, null, null, -t.spacing.xxxl],
              transform: "skewy(-9deg)",
              transformOrigin: "50% 0",
              zIndex: -1,
            },
            ...py([t.spacing.xxl, null, t.spacing.xxxl, 140]),
            position: "relative",
            textAlign: "center",
          }))}
        >
          <div css={s(belt, { position: "relative" })}>
            <LazyAnimation>
              <h2
                css={s(headingAlpha, (t) => ({
                  paddingBottom: [t.spacing.xl, null, t.spacing.xxl],
                }))}
              >
                {t("shelterPage:how.title")}
              </h2>
            </LazyAnimation>
            <Grid
              _css={s({
                position: "relative",
              })}
              gx={[spacing.lg, null, null, spacing.xl]}
              gy={[spacing.xl, null, spacing.xxl]}
              itemWidth={[
                percentage(1),
                null,
                percentage(1 / 2),
                percentage(1 / 4),
              ]}
            >
              <div
                css={s({
                  display: ["none", null, null, "flex"],
                  justifyContent: "space-between",
                  left: "18.5%",
                  position: "absolute",
                  right: "18.5%",
                  top: 110,
                  transform: "scaleY(1)",
                })}
              >
                <Icon
                  _css={s((t) => ({
                    color: t.color.tint.pistachio,
                    marginTop: t.spacing.sm,
                    width: [null, null, null, 120, 140],
                  }))}
                  path={pawPrints}
                  viewBox="0 0 146 49"
                />
                <Icon
                  _css={s((t) => ({
                    color: t.color.tint.pistachio,
                    marginTop: -t.spacing.lg,
                    transform: "scaleY(-1)",
                    width: [null, null, null, 120, 140],
                  }))}
                  path={pawPrints}
                  viewBox="0 0 146 49"
                />
                <Icon
                  _css={s((t) => ({
                    color: t.color.tint.pistachio,
                    marginTop: t.spacing.sm,
                    width: [null, null, null, 120, 140],
                  }))}
                  path={pawPrints}
                  viewBox="0 0 146 49"
                />
              </div>
              <Item>
                <LazyAnimation>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [140, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={STEP1_IMG}
                    />
                  </div>
                  <h2
                    css={s(headingCharlie, (t) => ({
                      marginBottom: t.spacing.xs,
                      marginTop: t.spacing.md,
                    }))}
                  >
                    {t("shelterPage:how.item1.title")}
                  </h2>
                  <p
                    css={s(bodyText, {
                      fontSize: 16,
                      margin: "0 auto",
                      maxWidth: 240,
                    })}
                  >
                    {t("shelterPage:how.item1.text")}
                  </p>
                </LazyAnimation>
              </Item>
              <Item>
                <LazyAnimation>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [140, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={STEP2_IMG}
                    />
                  </div>
                  <h2
                    css={s(headingCharlie, (t) => ({
                      marginBottom: t.spacing.xs,
                      marginTop: t.spacing.md,
                    }))}
                  >
                    {t("shelterPage:how.item2.title")}
                  </h2>
                  <p
                    css={s(bodyText, {
                      fontSize: 16,
                      margin: "0 auto",
                      maxWidth: 240,
                    })}
                  >
                    {t("shelterPage:how.item2.text")}
                  </p>
                </LazyAnimation>
              </Item>
              <Item>
                <LazyAnimation>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [140, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={STEP3_IMG}
                    />
                  </div>
                  <h2
                    css={s(headingCharlie, (t) => ({
                      marginBottom: t.spacing.xs,
                      marginTop: t.spacing.md,
                    }))}
                  >
                    {t("shelterPage:how.item3.title")}
                  </h2>
                  <p
                    css={s(bodyText, {
                      fontSize: 16,
                      margin: "0 auto",
                      maxWidth: 240,
                    })}
                  >
                    {t("shelterPage:how.item3.text")}
                  </p>
                </LazyAnimation>
              </Item>
              <Item>
                <LazyAnimation>
                  <div
                    css={s({
                      margin: "auto",
                      maxWidth: [140, null, null],
                    })}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{
                        width: "100vw",
                      }}
                      src={STEP4_IMG}
                    />
                  </div>
                  <h2
                    css={s(headingCharlie, (t) => ({
                      marginBottom: t.spacing.xs,
                      marginTop: t.spacing.md,
                    }))}
                  >
                    {t("shelterPage:how.item4.title")}
                  </h2>
                  <p
                    css={s(bodyText, {
                      fontSize: 16,
                      margin: "0 auto",
                      maxWidth: 240,
                    })}
                  >
                    {t("shelterPage:how.item4.text")}
                  </p>
                </LazyAnimation>
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
              gy={(t) => t.spacing.xl}
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
            >
              <Item>
                <LazyAnimation>
                  <div
                    css={s(ratio(1), (t) => ({
                      paddingBottom: [64, t.spacing.xl],
                      position: "relative",
                    }))}
                  >
                    {shelterDogs.map(({ key, publicId, version }, index) => (
                      <AnimatePresence initial={false} key={key}>
                        {currentShelterImage === index && (
                          <motion.div
                            animate="show"
                            exit="hide"
                            initial="hide"
                            transition={{ duration: 0.5 }}
                            variants={{
                              hide: { opacity: 0, scale: 0.9 },
                              show: { opacity: 1, scale: 1 },
                            }}
                          >
                            <CloudinaryUploadedAnimation
                              publicId={publicId}
                              version={version}
                              width={720}
                            />
                            <p
                              css={s(bodyTextSmall, (t) => ({
                                marginTop: t.spacing.sm,
                                ...px([0, t.spacing.md, t.spacing.lg]),
                                textAlign: "center",
                              }))}
                            >
                              {t(`shelterPage:give.${key}`)}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>
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
                    paddingBottom: [0, null, t.spacing.xxl, t.spacing.xxxl],
                    paddingTop: [0, null, t.spacing.xxl, t.spacing.xxxl, 160],
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      <Trans i18nKey="shelterPage:give.title" />
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        paddingBottom: [t.spacing.md, null, t.spacing.lg],
                      }))}
                    >
                      {t("shelterPage:give.text")}
                    </p>
                    <Link css={s(primaryButton())} to="/products">
                      {t("shelterPage:give.cta")}
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
              gy={spacing.xl}
              itemWidth={[percentage(1), null, percentage(1 / 2)]}
            >
              <Item>
                <LazyAnimation>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, null] }}
                    src={RESQWALK_IMG}
                  />
                </LazyAnimation>
              </Item>
              <Item
                _css={s({
                  alignItems: "flex-start",
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
                    ...py([0, null, null, t.spacing.xxl, t.spacing.xxxl]),
                  }))}
                >
                  <LazyAnimation>
                    <h2
                      css={s(headingAlpha, (t) => ({
                        paddingBottom: t.spacing.md,
                      }))}
                    >
                      {t("shelterPage:resqwalk.title")}
                    </h2>
                    <p
                      css={s(bodyText, (t) => ({
                        fontSize: 16,
                        marginBottom: t.spacing.lg,
                      }))}
                    >
                      {t("shelterPage:resqwalk.text")}
                    </p>
                    <ul
                      css={s((t) => ({
                        marginBottom: t.spacing.xl,
                      }))}
                    >
                      <li css={featureUnorderedListItem}>
                        {t("shelterPage:resqwalk.item1")}
                      </li>
                      <li css={featureUnorderedListItem}>
                        {t("shelterPage:resqwalk.item2")}
                      </li>
                      <li css={featureUnorderedListItem}>
                        {t("shelterPage:resqwalk.item3")}
                      </li>
                    </ul>

                    <a
                      href="https://apps.apple.com/us/app/resqwalk/id889050235"
                      rel="noreferrer noopener"
                      target="_blank"
                      css={s((t) => ({
                        display: "inline-block",
                        marginRight: t.spacing.xs,
                        position: "relative",
                        width: 140,
                      }))}
                    >
                      <ResponsiveImage
                        alt=""
                        sizes={{
                          maxWidth: 140,
                          width: "100vw",
                        }}
                        src={APP_STORE_IMG}
                      />
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.resqwalk&hl=en_GB&gl=US"
                      rel="noreferrer noopener"
                      target="_blank"
                      css={s({
                        display: "inline-block",
                        position: "relative",
                        width: 140,
                      })}
                    >
                      <ResponsiveImage
                        alt=""
                        sizes={{
                          maxWidth: 140,
                          width: "100vw",
                        }}
                        src={PLAY_STORE_IMG}
                      />
                    </a>
                    <p
                      css={s(bodyTextSmall, (t) => ({
                        fontSize: [12, null, 14],
                        marginTop: t.spacing.lg,
                      }))}
                    >
                      {t("shelterPage:resqwalk.footnote")}
                    </p>
                  </LazyAnimation>
                </div>
              </Item>
            </Grid>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default SheltersPage;

export const getStaticProps = makeStaticPropsGetter(async () => ({
  props: {},
  revalidate: 5 * 60,
}));
