import { NextPageWithApollo, throwGraphQLErrors } from "@sss/apollo";
import { useCart } from "@sss/ecommerce/cart";
import type { Collection, CollectionData } from "@sss/ecommerce/collection";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { motion } from "framer-motion";
import React from "react";
import { Trans } from "react-i18next";
import { JsonLd } from "react-schemaorg";
import { Organization as OrganizationDts } from "schema-dts";

import {
  belt,
  greedy,
  gutter,
  gutterX,
  gutterY,
  mx,
  my,
  percentage,
  px,
  py,
  ratio,
  s,
  size,
  useTheme,
  visuallyHidden,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import LOGO_IMG from "../../assets/images/common/LOGO_FOREST.png";
import FOOD_NATURAL_IMG from "../../assets/images/food/NATURAL.jpg";
import { SOCIAL } from "../../config";
import {
  primaryButton,
  secondaryButton,
  textButton,
} from "../../ui/base/button";
import { card } from "../../ui/base/card";
import Carousel from "../../ui/base/carousel";
import { Grid, Item } from "../../ui/base/grid";
import Hero from "../../ui/base/hero";
import Icon from "../../ui/base/icon";
import ResponsiveImage, {
  getNextImageUrl,
} from "../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDeltaStatic,
  headingEcho,
} from "../../ui/base/typography";
import benefits from "../../ui/icons/benefits";
import playArrow from "../../ui/icons/playArrow";
import PressBanner from "../../ui/modules/press-banner";
import ProductListingItem from "../../ui/modules/products/listing-item";
import Stars from "../../ui/modules/reviews/stars";
import Standard from "../../ui/templates/standard";
import BEST_FRIENDS_IMG from "./assets/BEST_FRIENDS.jpg";
import BEST_FRIENDS_LOGO_IMG from "./assets/BEST_FRIENDS_LOGO.png";
import DOG_IMG from "./assets/dog.jpg";
import SCIENCE_EXPERTS_IMG from "./assets/EXPERTS.png";
import HERO_IMG from "./assets/HERO.jpg";
import HERO_MOBILE_IMG from "./assets/HERO_MOBILE.jpg";
import HOW_IT_WORKS_IMG from "./assets/HOW_IT_WORKS.jpg";
import INGREDIENTS_IMG from "./assets/INGREDIENTS.jpg";
import INGREDIENTS_MOBILE_IMG from "./assets/INGREDIENTS_MOBILE.jpg";
import OG_IMG from "./assets/OPENGRAPH.jpg";
import PREFOOTER_IMG from "./assets/PREFOOTER.jpg";
import PREFOOTER_MOBILE_IMG from "./assets/PREFOOTER_MOBILE.jpg";
import SCIENCE_RESEARCH_IMG from "./assets/RESEARCH.jpg";
import SIMPLICITY_RESULTS_IMG from "./assets/simplicity/RESULTS.png";
import SIMPLICITY_SCOOP_IMG from "./assets/simplicity/SCOOP.png";
import SIMPLICITY_TASTY_IMG from "./assets/simplicity/TASTY.png";
import SCIENCE_TESTING_IMG from "./assets/TESTING.jpg";
import HOME_YOUTUBE_YT_CARD_STACKED_IMG from "./assets/youtube/card-stacked-x4.png";
import HOME_YOUTUBE_YTX4_IMG from "./assets/youtube/ytx4.png";
import { HOME_PAGE, HomePage, HomePageData } from "./homeQuery";

const enUsResource = {
  benefits: {
    brain: "Brain",
    dental: "Dental",
    gut: "Gut",
    heart: "Heart",
    immunity: "Immunity",
    joints: "Joints",
    skin: "Skin & Coat",
    stress: "Stress Relief",
    text: "Benefits that go beyond a healthy diet",
  },
  bestFriends: {
    cta: "Find out more  ",
    text1:
      "Every day more than 1,700 dogs and cats are killed in our nation’s shelters because they don’t have safe places to call home. But people like you are changing that. ",
    text2:
      "We are proud to partner with Best Friends to help them achieve their mission of reaching no-kill in this country by 2025. ",
    text3:
      "Every order you place generates money for your <i>local no-kill shelter</i>. And we go further... As official sponsors of the ResQWalk app every walk you take with your dog raises money too! ",
    title: "Together we can <i>save</i> them all",
  },
  delivery: {
    cta: "Shop now",
    text:
      "Hook your doggo up with a subscription and save on every delivery. You can cancel or change your delivery schedule any time. Free shipping on all orders over {{ amount }}.",
    title: "Lifelong <i>support</i> delivered to your door",
  },
  food: {
    cta: "Get 20% off and early access",
    text:
      "All natural, organic ingredients gently air-dried for fresh food quality with dry food convenience.",
    title: "Natural Air-Dried Food For Dogs <br /><i>Coming Soon</i>",
  },
  header: {
    cta: "Shop now",
    strapline: "Top-to-tail proven support in a simple daily powder.",
    subscription: "<Highlight>Save 10%</Highlight> on repeat orders",
    title: "Dog supplements, <i>reinvented.</i>",
  },
  ingredients: {
    cta: "Our ingredients",
    text:
      "Your dog’s supplement is only as good as what’s inside it. Most chew supplements contain unproven ingredients and up to 70% fillers. Ours is a pure, tasty powder made entirely from clinically-proven extracts.",
    title: "Ingredients that<br /> <i>actually</i> work",
  },
  meta: {
    description:
      "Our mission is to lead the revolution in pet health. We specialize in vet-recommended dog supplements with clinically proven ingredients | Click for offers",
    openGraph: {
      description: "We specialize in vet-recommended dog supplements",
      title: "Front Of The Pack - Proven, Powerful Dog Supplements",
    },
    title: "Front Of The Pack - Proven & Powerful - Top Dog Supplements",
  },
  products: {
    cta: "Shop supplements",
    text:
      "We’ve combined a unique format with clinically-proven ingredients, in a range of tasty daily supplements guaranteed to make your pup thrive.",
    title: "Give Your Bestie A Natural Boost",
  },
  science: {
    experts: {
      cta:
        "Learn more <VisuallyHidden>about our world-class Science Advisory Board</VisuallyHidden>",
      text:
        "Our Science Advisory Board brings together the brightest minds in biochemistry, immunology, animal nutrition and veterinary science.",
      title: "Led by science",
    },
    research: {
      cta:
        "Learn more <VisuallyHidden>about the science behind your dog’s supplement</VisuallyHidden>",
      text:
        "Our team of experts have evaluated over 481 research publications to develop a range of supplements rigorously backed by science.",
      title: "Uncompromising research",
    },
    testing: {
      cta:
        "Learn more <VisuallyHidden>about how we put your dog’s supplement to the test</VisuallyHidden>",
      text:
        "By putting our ingredients under the microscope not once, not twice, but eight times, we’re raising standards for testing in pet supplements.",
      title: "Testing & transparency",
    },
    title: "Our approach",
  },
  simplicity: {
    delivered: {
      text:
        "When used on a daily basis, improvements should begin to appear within 4-6 weeks.",
      title: "Real results",
    },
    flavour: {
      text:
        "Blended with a broth-like flavor proven to appeal to the fussiest of dogs.",
      title: "Delicious flavor",
    },
    stick: {
      text:
        "Sprinkle onto your dog’s food once a day, or mix it in with their favorite snack.",
      title: "Scoop and serve",
    },
    title: "Tasty for them.<br /> <i>Simple for you.</i>",
  },
  testimonials: {
    text: "See what our customers have to say",
    title: "Over $t(common:happyPups) Happy & Healthy Pups ",
  },
  treats: {
    cta: "Shop treats",
    text:
      "Prepared from pure, raw, proteins. Freeze-Dried using a slow 48-hour process that locks in the vital nutrients without cooking the food.",
    title: "New Freeze-Dried Guilt Free Treats",
  },
  youtube: {
    branding: "YouTube (logo)",
    cardStacked: "Ask me anything about dogs",
    cta: "Watch Now",
    title:
      "Stay up-to-date with our latest dog training, nutrition and vet-led advice on our YouTube channel",
  },
};

const benefitsArray = [
  { icon: benefits.joints, key: "joints" },
  { icon: benefits.calming, key: "stress" },
  { icon: benefits.digestion, key: "gut" },
  { icon: benefits.skinCoat, key: "skin" },
  { icon: benefits.protect, key: "immunity" },
  { icon: benefits.dental, key: "dental" },
  { icon: benefits.heart, key: "heart" },
  { icon: benefits.brain, key: "brain" },
];

interface HomeProps {
  collection: Collection;
  homePage: HomePage;
}

const Home: NextPageWithApollo<HomeProps> = ({
  collection: { products },
  homePage: { reviews },
}) => {
  const { shippingThreshold } = useCart();
  const { i18n, t } = useLocale();
  const formatCurrency = useCurrencyFormatter();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "home", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("home:meta.description")}
        title={t("home:meta.title")}
        openGraph={{
          description: t("home:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("home:meta.openGraph.title"),
        }}
      />
      <JsonLd<OrganizationDts>
        item={{
          "@context": "https://schema.org",
          "@type": "Organization",
          logo: `${process.env.ORIGIN}${getNextImageUrl({
            src: LOGO_IMG.src,
            width: 1200,
          })}`,
          name: t("common:fotp"),
          sameAs: [
            SOCIAL.facebook.url,
            SOCIAL.instagram.url,
            SOCIAL.pinterest.url,
          ],
          telephone: "323-922-5737",
          url: process.env.ORIGIN,
        }}
      />
      <main>
        <header
          css={s(gutter, (t) => ({
            color: t.color.text.light.base,
            height: [500, 572, "100vh"],
            maxHeight: ["none", null, 720, 800, 900],
            overflow: "hidden",
            position: "relative",
            ...py([t.spacing.xxl, t.spacing.xxxl]),
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": { ...greedy, objectFit: "cover" },
              zIndex: -1,
            })}
            priority
            quality={60}
            urls={[HERO_MOBILE_IMG.src, null, HERO_IMG.src]}
          />
          <motion.div
            animate={{
              opacity: 1,
              transition: { delay: 0.5, duration: 0.5 },
            }}
            css={s({
              backgroundColor: "rgba(38,26,3,0.25)",
              bottom: 0,
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
              zIndex: -1,
            })}
            initial={{ opacity: 0 }}
          />
          <div css={s(belt, { height: "100%", zIndex: 5 })}>
            <motion.div
              animate={{
                opacity: 1,
                transition: { delay: 0.25, duration: 0.5 },
                x: 0,
                y: 0,
              }}
              css={s({
                alignItems: ["flex-start", null, "center"],
                display: "flex",
                height: "100%",
                textAlign: "center",
              })}
              initial={{ opacity: 0, y: 20 }}
            >
              <div
                css={s((t) => ({
                  ...px([t.spacing.xs, t.spacing.lg, t.spacing.md, 0]),
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  width: "100%",
                }))}
              >
                <h1
                  css={s(headingAlpha, (t) => ({
                    fontSize: [40, 48, 54, 72],
                    lineHeight: 1,
                    marginBottom: [t.spacing.sm, null, null, t.spacing.lg],
                  }))}
                >
                  <Trans i18nKey="home:header.title" />
                </h1>
                <p
                  css={s(bodyText, (t) => ({
                    fontFamily: t.font.secondary.family,
                    fontSize: [18, 22, 25],
                    fontStyle: "italic",
                    fontWeight: t.font.secondary.weight.book,
                    marginBottom: [t.spacing.xxl, null, t.spacing.xl],
                  }))}
                >
                  {t("home:header.strapline")}
                </p>
                <Link
                  css={s(belt, primaryButton(), {
                    maxWidth: 280,
                    textShadow: "none",
                    width: "100%",
                    ...px(0),
                  })}
                  to="/products"
                >
                  {t("home:header.cta")}
                </Link>
                <div css={s((t) => ({ marginTop: t.spacing.sm }))}>
                  <Trans
                    components={{
                      Highlight: (
                        <span
                          css={s((t) => ({
                            fontFamily: t.font.secondary.family,
                            fontSize: 20,
                          }))}
                        />
                      ),
                    }}
                    i18nKey="home:header.subscription"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
            color: t.color.text.dark.base,
            ...py(0),
            textAlign: "center",
          }))}
          id="intro"
        >
          <div css={s(belt)}>
            <PressBanner showLinks={false} />
          </div>
        </section>

        {/* Benefits */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
            paddingBottom: [t.spacing.xxl, null, null, t.spacing.xxxl],
            paddingTop: [t.spacing.xxl, null, null, 96],
            textAlign: "center",
          }))}
          id="intro"
        >
          <div css={s(belt)}>
            <h2
              css={s(headingBravo, (t) => ({
                marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                ...mx("auto"),
                maxWidth: [280, "none"],
              }))}
            >
              <Trans i18nKey="home:benefits.text" />
            </h2>
            <Grid
              gx={(t) => [t.spacing.xs, t.spacing.md, t.spacing.lg]}
              gy={(t) => [t.spacing.lg, null, t.spacing.xl]}
              itemWidth={[percentage(1 / 4), null, null, percentage(1 / 8)]}
            >
              {benefitsArray.map(({ icon, key }, index) => (
                <Item key={index}>
                  <Icon _css={s(size([48, 56, 64, 72]))} path={icon} />
                  <p
                    css={s(headingEcho, (t) => ({
                      fontWeight: t.font.primary.weight.medium,
                      marginTop: [t.spacing.xxs, t.spacing.sm],
                    }))}
                  >
                    {t(`home:benefits.${key}`)}
                  </p>
                </Item>
              ))}
            </Grid>
          </div>
        </section>

        {/* How it works */}
        <section
          css={s((t) => ({
            color: t.color.text.dark.base,
            marginBottom: [0, null, null, t.spacing.lg],
            ...mx("auto"),
          }))}
        >
          <Grid
            _css={s({ margin: "0 auto" })}
            itemWidth={["100%", null, null, "47%"]}
          >
            <Item>
              <div
                css={s({
                  display: [null, null, "none"],
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={HOW_IT_WORKS_IMG}
                />
              </div>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: [null, null, 600, 800, 900],
                  position: "relative",
                })}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes={{ width: ["100vw", null, "50vw"] }}
                  src={HOW_IT_WORKS_IMG}
                />
              </div>
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
                  maxWidth: 680,
                  paddingBottom: [t.spacing.lg, t.spacing.xl, null, 0],
                  paddingTop: [t.spacing.xxl, null, t.spacing.xxxl, 0],
                  ...px([t.spacing.md, t.spacing.xl]),
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [54, null, t.spacing.xxl],
                    ...mx(["auto", null, 0]),
                    maxWidth: 300,
                    textAlign: ["center", null, "left"],
                  }))}
                >
                  <Trans i18nKey="home:simplicity.title" />
                </h2>
                <div
                  css={s((t) => ({
                    alignItems: ["flex-start", "center", "flex-end"],
                    display: "flex",
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  <div
                    css={s((t) => ({
                      marginBottom: t.spacing.xxs,
                      maxWidth: [72, null, 110, 100],
                      width: "100%",
                    }))}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{ width: [72, null, 110, 100] }}
                      src={SIMPLICITY_SCOOP_IMG}
                    />
                  </div>
                  <div
                    css={s((t) => ({
                      paddingLeft: [t.spacing.sm, t.spacing.lg, t.spacing.xl],
                    }))}
                  >
                    <h3
                      css={s(headingCharlie, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("home:simplicity.stick.title")}
                    </h3>
                    <p css={s(bodyText)}>{t("home:simplicity.stick.text")}</p>
                  </div>
                </div>
                <div
                  css={s((t) => ({
                    alignItems: ["flex-start", "center", "flex-end"],
                    display: "flex",
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  <div
                    css={s((t) => ({
                      marginBottom: t.spacing.xxs,
                      maxWidth: [72, null, 110, 100],
                      width: "100%",
                    }))}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{ width: [72, null, 110, 100] }}
                      src={SIMPLICITY_TASTY_IMG}
                    />
                  </div>
                  <div
                    css={s((t) => ({
                      paddingLeft: [t.spacing.sm, t.spacing.lg, t.spacing.xl],
                    }))}
                  >
                    <h3
                      css={s(headingCharlie, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("home:simplicity.flavour.title")}
                    </h3>
                    <p css={s(bodyText)}>{t("home:simplicity.flavour.text")}</p>
                  </div>
                </div>
                <div
                  css={s({
                    alignItems: ["flex-start", "center", "flex-end"],
                    display: "flex",
                  })}
                >
                  <div
                    css={s((t) => ({
                      marginBottom: t.spacing.xxs,
                      maxWidth: [72, null, 110, 100],
                      width: "100%",
                    }))}
                  >
                    <ResponsiveImage
                      alt=""
                      sizes={{ width: [72, null, 110, 100] }}
                      src={SIMPLICITY_RESULTS_IMG}
                    />
                  </div>
                  <div
                    css={s((t) => ({
                      paddingLeft: [t.spacing.sm, t.spacing.lg, t.spacing.xl],
                    }))}
                  >
                    <h3
                      css={s(headingCharlie, (t) => ({
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t("home:simplicity.delivered.title")}
                    </h3>
                    <p css={s(bodyText)}>
                      {t("home:simplicity.delivered.text")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                css={s((t) => ({
                  display: ["block", null, "none"],
                  marginTop: t.spacing.lg,
                  width: "100%",
                }))}
              >
                <ResponsiveImage alt="" sizes="100vw" src={DOG_IMG} />
              </div>
            </Item>
          </Grid>
        </section>

        {/* Products */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
          }))}
        >
          <div css={s(belt)}>
            <Grid gx={(t) => [0, null, t.spacing.xxl, t.spacing.xxxl]}>
              <Item width={["100%", null, null, percentage(1 / 3)]}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    ...my([t.spacing.sm, null, t.spacing.md]),
                    textAlign: ["center", null, null, "left"],
                  }))}
                >
                  <Trans i18nKey="home:products.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xl,
                    textAlign: ["center", null, null, "left"],
                  }))}
                >
                  {t("home:products.text")}
                </p>
                <Link
                  css={s(primaryButton(), {
                    display: ["none", null, null, "inline-block"],
                    maxWidth: ["none", null, 300],
                    width: "100%",
                  })}
                  to="/collections/supplements"
                >
                  {t("home:products.cta")}
                </Link>
              </Item>
              <Item width={["100%", null, null, percentage(2 / 3)]}>
                <Grid
                  itemWidth={["100%", "50%"]}
                  gx={(t) => [
                    t.spacing.sm,
                    t.spacing.md,
                    t.spacing.xl,
                    t.spacing.md,
                  ]}
                  gy={(t) => [t.spacing.xl, t.spacing.xxl]}
                >
                  {products.edges.map(({ node }, position) => (
                    <Item key={node.id}>
                      <ProductListingItem
                        _css={s({ height: "100%" })}
                        collectionName="Home"
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
              </Item>
            </Grid>
            <Link
              css={s(primaryButton(), (t) => ({
                display: ["block", null, null, "none"],
                marginTop: t.spacing.lg,
                maxWidth: ["none", null, 300],
                ...mx(["auto", null, null, 0]),
                width: "100%",
              }))}
              to="/products"
            >
              {t("home:products.cta")}
            </Link>
          </div>
        </section>

        <section
          css={s((t) => ({
            backgroundColor: t.color.background.feature1,
          }))}
        >
          <Grid
            direction="rtl"
            gx={theme.spacing.md}
            itemWidth={["100%", null, "50%"]}
          >
            <Item>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: [null, null, 600, 640],
                  position: "relative",
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  src={FOOD_NATURAL_IMG}
                  layout="fill"
                  objectFit="cover"
                  quality={50}
                  sizes="50vw"
                />
              </div>
              <div css={s({ display: [null, null, "none"] })}>
                <ResponsiveImage alt="" sizes="100vw" src={FOOD_NATURAL_IMG} />
              </div>
            </Item>
            <Item
              _css={s({
                alignItems: "flex-end",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: ["center", null, "left"],
              })}
            >
              <div
                css={s((t) => ({
                  maxWidth: [null, null, (1280 - t.spacing.md) / 2],
                  paddingLeft: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  paddingRight: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  ...py([t.spacing.xl, null, 0]),
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                  }))}
                >
                  <Trans i18nKey="home:food.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.md, null, t.spacing.lg],
                  }))}
                >
                  {t("home:food.text")}
                </p>
                <Link
                  css={s(primaryButton(), (t) => ({ ...px(t.spacing.sm) }))}
                  to="/food"
                >
                  {t("home:food.cta")}
                </Link>
              </div>
            </Item>
          </Grid>
        </section>

        {/* Testimonials */}
        {!!reviews?.length && (
          <section
            css={s(gutterY, (t) => ({
              position: "relative",
              textAlign: "center",
              ...px([null, null, t.spacing.lg, t.spacing.xl, t.spacing.xxl]),
            }))}
            id="testimonials"
          >
            <div css={s(belt)}>
              <div css={s(gutterX)}>
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  <Trans i18nKey={`home:testimonials.title`} />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                  }))}
                >
                  {t(`home:testimonials.text`)}
                </p>
              </div>
              <Carousel
                _css={s(belt)}
                controls={{ DotContainer: null }}
                gutter={theme.spacing.md}
                innerCss={s((t) => ({
                  maxWidth: 1280 + 2 * t.spacing.xs, // Compensate for horizontal padding
                  ...my(-t.spacing.xs), // Compensate for vertical padding
                  ...px([t.spacing.md, null, t.spacing.xs]),
                  ...py(t.spacing.xs),
                }))}
                slidesToShow={[1.2, 2.2, 3, 4]}
              >
                {reviews.map(({ review }) => {
                  if (!review) {
                    return null;
                  }

                  const { _meta, highlight, image, rating, reviewer } = review;

                  if (!highlight || !reviewer) {
                    return null;
                  }

                  return (
                    <article
                      key={_meta.id}
                      css={s(card, (t) => ({
                        borderRadius: t.radius.md,
                        height: "100%",
                        maxWidth: 320,
                        overflow: "hidden",
                        textAlign: "left",
                      }))}
                    >
                      <div
                        css={s(ratio(3 / 4), (t) => ({
                          backgroundColor: t.color.background.dark,
                        }))}
                      >
                        {image && (
                          <ResponsiveImage
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            sizes={{ width: 320 }}
                            src={image.url}
                          />
                        )}
                      </div>
                      <div
                        css={s(bodyTextStatic, (t) => ({
                          ...py(t.spacing.md),
                          ...px(t.spacing.sm),
                        }))}
                      >
                        <h3
                          css={s(headingDeltaStatic, (t) => ({
                            marginBottom: t.spacing.xs,
                          }))}
                        >
                          <RichTextFragment render={reviewer} />
                        </h3>
                        <Stars
                          _css={s((t) => ({
                            display: "block",
                            height: 20,
                            marginBottom: t.spacing.sm,
                            width: 120,
                          }))}
                          value={rating ?? 5}
                        />
                        <RichTextFragment render={highlight} />
                      </div>
                    </article>
                  );
                })}
              </Carousel>
              <div css={s(gutterX)}>
                <Link
                  css={s(belt, primaryButton(), (t) => ({
                    marginTop: t.spacing.lg,
                    maxWidth: ["none", null, 300],
                    ...px(0),
                    width: "100%",
                  }))}
                  to="/products"
                >
                  {t("home:header.cta")}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Youtube Promo */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature2,
            color: t.color.text.dark.base,
            ...py(t.spacing.xxl),
          }))}
        >
          <div css={s(belt)}>
            <Grid
              gx={(t) => [0, null, t.spacing.lg, t.spacing.xxl]}
              align="center"
              innerCss={s({
                alignItems: "center",
                textAlign: ["left", "center", "left"],
              })}
            >
              <Item width={["100%", null, "60%"]}>
                <a
                  href="https://www.youtube.com/channel/UCjfrM1jSY4JGGNEB09U9tIA/featured"
                  rel="noreferrer noopener"
                  target="_blank"
                  css={s({
                    "& img": {
                      filter: "brightness(100%)",
                      transition: "all 150ms ease-in-out",
                    },
                    "&:hover": {
                      "& img": {
                        filter: "brightness(90%)",
                        transition: "all 150ms ease-in-out",
                      },
                      "& svg ": {
                        transform: "scale(1.25)",
                        transition: "all 150ms ease-in-out",
                      },
                    },
                    display: "block",
                  })}
                >
                  <div
                    css={s({
                      position: "relative",
                    })}
                  >
                    <ResponsiveImage
                      alt={t("home:youtube.cardStacked")}
                      sizes={{
                        maxWidth: [null, null, 740],
                        width: ["100vw", null, "60vw"],
                      }}
                      src={HOME_YOUTUBE_YT_CARD_STACKED_IMG}
                    />
                    <div
                      css={s({
                        alignItems: "center",
                        bottom: "0",
                        display: "flex",
                        justifyContent: "center",
                        left: "0",
                        position: "absolute",
                        right: "0",
                        top: "0",
                      })}
                    >
                      <Icon
                        _css={s((t) => ({
                          ...size([60, null, 80]),
                          backgroundColor: t.color.background.feature1,
                          borderRadius: "50px",
                          color: t.color.background.base,
                          transform: "scale(1)",
                          transition: "all 150ms ease-in-out",
                        }))}
                        path={playArrow}
                      />
                    </div>
                  </div>
                </a>
              </Item>

              <Item width={["100%", "100%", "40%", "40%"]}>
                <div
                  css={s((t) => ({
                    marginLeft: [0, "auto", 0],
                    marginRight: [0, "auto", 0],
                    marginTop: [t.spacing.md, t.spacing.lg, t.spacing.lg, 0],
                    maxWidth: "80px",
                    textAlign: ["left", "center", "left"],
                  }))}
                >
                  <ResponsiveImage
                    alt={t("home:youtube.branding")}
                    sizes={{ width: 80 }}
                    src={HOME_YOUTUBE_YTX4_IMG}
                  />
                </div>

                <h2
                  css={s(headingCharlie, (t) => ({
                    ...my([t.spacing.md, null, t.spacing.lg]),
                    ...mx([0, t.spacing.md, 0, 0]),
                    paddingRight: [0, 0, 0, 0, t.spacing.xxxl],
                  }))}
                >
                  <Trans i18nKey="home:youtube.title" />
                </h2>

                <a
                  css={s(secondaryButton())}
                  href="https://www.youtube.com/channel/UCjfrM1jSY4JGGNEB09U9tIA/featured"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Trans i18nKey="home:youtube.cta" />
                </a>
              </Item>
            </Grid>
          </div>
        </section>

        {/* Ingredients */}
        <section
          css={s(gutter, (t) => ({
            color: t.color.text.dark.base,
            position: "relative",
            textAlign: ["center", null, "left"],
          }))}
        >
          <Hero
            _css={s(greedy, (t) => ({
              "& > *": { ...greedy, objectFit: "cover" },
              backgroundColor: t.color.background.feature1,
              zIndex: -1,
            }))}
            quality={60}
            urls={[INGREDIENTS_MOBILE_IMG.src, null, INGREDIENTS_IMG.src]}
          />
          <div
            css={s((t) => ({
              paddingBottom: ["60%", null, t.spacing.xl, t.spacing.xxl],
              paddingRight: [0, null, t.spacing.xl, t.spacing.xxxl],
              paddingTop: [0, t.spacing.md, t.spacing.xl, t.spacing.xxl],
              width: ["100%", null, "50%"],
            }))}
          >
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: [t.spacing.sm, null, t.spacing.md],
              }))}
            >
              <Trans i18nKey="home:ingredients.title" />
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
                maxWidth: [400, null, "none"],
                ...mx("auto"),
              }))}
            >
              {t("home:ingredients.text")}
            </p>
            <Link css={s(secondaryButton())} to="/science/ingredients">
              {t("home:ingredients.cta")}
            </Link>
          </div>
        </section>

        {/* Science */}
        <div css={s({ overflow: "hidden" })}>
          <section
            css={s(gutter, (t) => ({
              color: t.color.text.dark.base,
            }))}
          >
            <div css={s(belt, (t) => px([0, t.spacing.lg, 0]))}>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: [t.spacing.xxl, null, 96],
                  textAlign: "center",
                }))}
              >
                <Trans i18nKey="home:science.title" />
              </h2>
              <Grid
                itemWidth={[percentage(1), null, percentage(1 / 3)]}
                gx={(t) => [0, null, t.spacing.md, t.spacing.lg, t.spacing.xl]}
                gy={(t) => t.spacing.xxl}
              >
                <Item>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, "33vw"] }}
                    src={SCIENCE_EXPERTS_IMG}
                  />
                  <h3
                    css={s(headingCharlie, (t) => ({
                      marginBottom: [t.spacing.sm, null, t.spacing.md],
                      marginTop: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <Trans i18nKey="home:science.experts.title" />
                  </h3>
                  <p css={s(bodyText)}>{t("home:science.experts.text")}</p>
                  <Link
                    css={s(textButton(), (t) => ({ marginTop: t.spacing.lg }))}
                    to="/science/experts"
                  >
                    <Trans
                      components={
                        {
                          VisuallyHidden: <span css={s(visuallyHidden)} />,
                        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                      }
                      i18nKey="home:science.experts.cta"
                    />
                  </Link>
                </Item>
                <Item>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, "33vw"] }}
                    src={SCIENCE_RESEARCH_IMG}
                  />
                  <h3
                    css={s(headingCharlie, (t) => ({
                      marginBottom: [t.spacing.sm, null, t.spacing.md],
                      marginTop: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <Trans i18nKey="home:science.research.title" />
                  </h3>
                  <p css={s(bodyText)}>{t("home:science.research.text")}</p>
                  <Link
                    css={s(textButton(), (t) => ({ marginTop: t.spacing.lg }))}
                    to="/science/evidence"
                  >
                    <Trans
                      components={
                        {
                          VisuallyHidden: <span css={s(visuallyHidden)} />,
                        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                      }
                      i18nKey="home:science.research.cta"
                    />
                  </Link>
                </Item>
                <Item>
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, "33vw"] }}
                    src={SCIENCE_TESTING_IMG}
                  />
                  <h3
                    css={s(headingCharlie, (t) => ({
                      marginBottom: [t.spacing.sm, null, t.spacing.md],
                      marginTop: [t.spacing.md, null, t.spacing.lg],
                    }))}
                  >
                    <Trans i18nKey="home:science.testing.title" />
                  </h3>
                  <p css={s(bodyText)}>{t("home:science.testing.text")}</p>
                  <Link
                    css={s(textButton(), (t) => ({ marginTop: t.spacing.lg }))}
                    to="/science/testing-and-transparency"
                  >
                    <Trans
                      components={
                        {
                          VisuallyHidden: <span css={s(visuallyHidden)} />,
                        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                      }
                      i18nKey="home:science.testing.cta"
                    />
                  </Link>
                </Item>
              </Grid>
            </div>
          </section>

          <section
            css={s(gutterY, (t) => ({
              color: t.color.text.dark.base,
              paddingTop: 0,
            }))}
          >
            <Grid
              _css={s({ margin: "0 auto" })}
              itemWidth={["100%", null, null, "47%"]}
            >
              <Item>
                <div
                  css={s({
                    display: [null, null, "none"],
                    width: "100%",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    sizes={{ width: ["100vw", null, "50vw"] }}
                    src={BEST_FRIENDS_IMG}
                  />
                </div>
                <div
                  css={s({
                    display: ["none", null, "block"],
                    height: [null, null, 600, 800],
                    position: "relative",
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes={{ width: ["100vw", null, "50vw"] }}
                    src={BEST_FRIENDS_IMG}
                  />
                </div>
              </Item>
              <Item
                _css={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: "1",
                  justifyContent: "center",
                }}
              >
                <div
                  css={s(gutter, (t) => ({
                    maxWidth: 680,
                    paddingBottom: 0,
                    paddingTop: [t.spacing.xxl, null, t.spacing.xxxl, 0],
                    ...px([t.spacing.md, t.spacing.xl]),
                  }))}
                >
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: [t.spacing.md, null, t.spacing.lg],
                      ...mx(["auto", null, 0]),
                      maxWidth: 400,
                      textAlign: ["center", null, "left"],
                    }))}
                  >
                    <Trans i18nKey="home:bestFriends.title" />
                  </h2>
                  <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
                    {t("home:bestFriends.text1")}
                  </p>
                  <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
                    {t("home:bestFriends.text2")}
                  </p>
                  <div
                    css={s((t) => ({
                      borderColor: t.color.background.dark,
                      borderStyle: "solid",
                      borderWidth: 1,
                      marginTop: t.spacing.lg,
                      ...py(t.spacing.lg),
                      ...px(t.spacing.md),
                    }))}
                  >
                    <p
                      css={s(bodyText, (t) => ({
                        fontWeight: t.font.primary.weight.medium,
                      }))}
                    >
                      <Trans i18nKey="home:bestFriends.text3" />
                    </p>
                    <div
                      css={s((t) => ({
                        alignItems: "center",
                        display: ["block", null, "flex"],
                        justifyContent: "space-between",
                        marginTop: [t.spacing.sm, null, t.spacing.md],
                      }))}
                    >
                      <Link
                        css={s(textButton())}
                        to="/mission/supporting-shelters"
                      >
                        {t("home:bestFriends.cta")}
                      </Link>
                      <div
                        css={s((t) => ({
                          marginTop: [t.spacing.md, null, 0],
                          maxWidth: 200,
                          width: "100%",
                        }))}
                      >
                        <ResponsiveImage
                          alt=""
                          sizes="200px"
                          src={BEST_FRIENDS_LOGO_IMG}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Item>
            </Grid>
          </section>

          {/* Delivery */}
          <section
            css={s(gutterX, (t) => ({
              color: t.color.text.dark.base,
              position: "relative",
              textAlign: ["center", null, "left"],
            }))}
          >
            <Hero
              _css={s(greedy, {
                "& > *": { ...greedy, objectFit: "cover" },
                backgroundColor: "#BBC4BA",
                zIndex: -1,
              })}
              quality={60}
              urls={[PREFOOTER_MOBILE_IMG.src, null, PREFOOTER_IMG.src]}
            />
            <div
              css={s(belt, (t) =>
                py([t.spacing.xl, t.spacing.xxl, 96, t.spacing.xxxl])
              )}
            >
              <div
                css={s((t) => ({
                  paddingBottom: [200, null, t.spacing.xxl, t.spacing.xxxl],
                  paddingRight: [0, null, t.spacing.xl, null, t.spacing.xxxl],
                  width: ["100%", null, "50%"],
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.sm, null, t.spacing.md],
                    maxWidth: [360, null, "none"],
                    ...mx("auto"),
                  }))}
                >
                  <Trans i18nKey="home:delivery.title" />
                </h2>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.xl,
                    maxWidth: [400, null, "none"],
                    ...mx("auto"),
                  }))}
                >
                  {t("home:delivery.text", {
                    amount:
                      shippingThreshold &&
                      formatCurrency({
                        ...shippingThreshold,
                        fractionDigits: 0,
                      }),
                  })}
                </p>
                <div
                  css={s((t) => ({
                    marginBottom: [t.spacing.lg, null, 0],
                    ...px([t.spacing.xs, 0]),
                  }))}
                >
                  <Link
                    css={s(belt, primaryButton(), {
                      maxWidth: [320, null, 300],
                      ...px(0),
                      width: "100%",
                    })}
                    to="/products"
                  >
                    {t("home:delivery.cta")}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Standard>
  );
};

export default Home;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const COLLECTION_BY_HANDLE = (await import("@sss/ecommerce/collection"))
      .COLLECTION_BY_HANDLE;

    const [home, collection] = await Promise.all([
      apolloClient.query<HomePageData>({
        fetchPolicy: "no-cache",
        query: HOME_PAGE,
      }),
      apolloClient.query<CollectionData>({
        fetchPolicy: "no-cache",
        query: COLLECTION_BY_HANDLE,
        variables: {
          first: 4,
          handle: "homepage-supplements",
        },
      }),
    ]);
    throwGraphQLErrors([home, collection]);

    if (!home.data?.homePage || !collection.data?.collection) {
      throw new Error(
        "Homepage data is unexpectedly missing from the API response"
      );
    }

    return {
      props: {
        collection: collection.data.collection,
        homePage: home.data.homePage,
      },
      revalidate: 60,
    };
  }
);
