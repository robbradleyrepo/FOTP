import { CloudinaryMedia, CloudinaryUploadedAnimation } from "@sss/cloudinary";
import { InView } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import Player from "@vimeo/player";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { rgba } from "polished";
import React, {
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Trans } from "react-i18next";
import { useInView } from "react-intersection-observer";

import {
  belt,
  ComponentStyleProps,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  mx,
  px,
  py,
  ratio,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import EXPERT_JAMIE_IMG from "../../../assets/images/common/experts/JAMIE.jpg";
import ASHWAGANDHA_IMG from "../../../assets/images/food/ASHWAGANDHA.png";
import HERO_IMG from "../../../assets/images/food/HERO.jpg";
import HERO_MOBILE_IMG from "../../../assets/images/food/HERO_MOBILE.jpg";
import JAMIE_VIDEO_POSTER_IMG from "../../../assets/images/food/JAMIE_VIDEO_POSTER.jpg";
import FOOD_NATURAL_IMG from "../../../assets/images/food/NATURAL.jpg";
import FOOD_TASTY_IMG from "../../../assets/images/food/TASTY.jpg";
import {
  makeProductPageStaticPropsGetter,
  UnifiedProductPageData,
} from "../../../cms/product-page";
import { useDogProfile, useDogProfilePronouns } from "../../../dogs/profile";
import { primaryButton } from "../../../ui/base/button";
import FeatureLayout from "../../../ui/base/feature-layout";
import { Grid, Item } from "../../../ui/base/grid";
import { orderedList, orderedListItem } from "../../../ui/base/ordered-list";
import ResponsiveImage from "../../../ui/base/responsive-image";
import Spinner, { PageSpinner } from "../../../ui/base/spinner";
import {
  bodyText,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
} from "../../../ui/base/typography";
import Footer from "../../../ui/modules/footer";
import ProductFeaturesFood from "../../../ui/modules/products/features/food";
import SalesFunnelHeader from "../../../ui/modules/sales-funnel-header";

enum VimeoPlayerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "",
  PENDING = "PENDING",
}

interface VimeoPlayerRenderProps {
  isActive: boolean;
  isBusy: boolean;
  isPending: boolean;
}

interface VimeoPlayerProps extends ComponentStyleProps {
  children: (props: VimeoPlayerRenderProps) => ReactNode;
  onClick?: MouseEventHandler;
  url: string;
}

const VimeoPlayer = ({
  _css = {},
  children,
  onClick,
  url,
}: VimeoPlayerProps) => {
  const [inViewRef, inView] = useInView();
  const playerRef = useRef<Player>();
  const wrapperElRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(VimeoPlayerStatus.INACTIVE);

  const handleEntrance = async () => {
    setStatus(VimeoPlayerStatus.PENDING);

    try {
      await playerRef.current?.play();

      // Only mark the video as active once the play request has succeeded
      setStatus(VimeoPlayerStatus.ACTIVE);
    } catch (error) {
      setStatus(VimeoPlayerStatus.INACTIVE);
    }
  };

  // We'll need to make the playback and fullscreen requests synchronously
  // within `handleClick` to ensure iOS views them as interactive events
  const handleClick: MouseEventHandler = async (...args) => {
    if (onClick) {
      onClick(...args);
    }

    handleEntrance();
  };

  useEffect(() => {
    if (!wrapperElRef.current) {
      return;
    }

    playerRef.current = new Player(wrapperElRef.current, {
      playsinline: false,
      url,
    });

    return () => {
      playerRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!inView) {
      playerRef.current?.pause();
    }
  }, [inView]);

  const fadeStyle = (hidden: boolean) => ({
    display: "block !important", // Override `[hidden]` styles as we're using opacity and visibility instead
    opacity: hidden ? 0 : 1,
    transitionDelay: hidden ? "0s, 500ms" : "0s", // Delay the change to `visibility: hidden`
    transitionDuration: "500ms, 0s",
    transitionProperty: "opacity, visibility",
    visibility: hidden ? "hidden" : "visible",
  });

  const isActive = status === VimeoPlayerStatus.ACTIVE;
  const isBusy = status !== VimeoPlayerStatus.INACTIVE;
  const isPending = status === VimeoPlayerStatus.PENDING;

  return (
    <div ref={inViewRef} css={s({ position: "relative" }, _css)}>
      <button
        css={s(greedy, fadeStyle(isActive))}
        hidden={isActive}
        onClick={handleClick}
      >
        {children({
          isActive,
          isBusy,
          isPending,
        })}
      </button>
      <div
        ref={wrapperElRef}
        css={s(greedy, {
          "& > iframe": size("100%"),
          ...fadeStyle(!isActive),
        })}
        hidden={!isActive}
      />
    </div>
  );
};

interface FoodEarlyAccessPageProps {
  data: UnifiedProductPageData;
}

const FoodEarlyAccessPage: FC<FoodEarlyAccessPageProps> = ({ data }) => {
  const profilePronouns = useDogProfilePronouns();
  const { i18n, t } = useLocale();
  const router = useRouter();

  i18n.addResourceBundle("en-US", "FoodEarlyAccessPage", {
    blindTasting: {
      alt:
        "A beautiful Labrador Retriever sits attentively in front of two bowls: one containing kibble and the other containing Front Of The Pack’s air-dried food. When given the command to eat, the Labrador heads straight for the Front Of The Pack, and, tail wagging enthusiastically, starts eating.",
      description:
        "Blind-taste tested with hundreds of dogs. And this is the result…",
      title: "A taste that dogs love",
    },
    confirm: {
      description:
        "All your bestie’s details are loaded and ready. We just need you to confirm in case anything’s change since you entered them",
      title: "Confirm your order",
    },
    cta: "Confirm your order",
    expert: {
      name: "Dr. Jamie Peyton",
      quote: `
      <Paragraph>As a pet parent to rescue dogs at our animal sanctuary in Northern California, I know first-hand that the love you share with your dogs is one of the most positive forces on the planet.</Paragraph>
      <Paragraph>And in my professional work at the #1 veterinary school in the world, I’ve often seen the transformative impact nutrition can have on a dog’s well-being.</Paragraph>
      <Paragraph>After spending years searching for something healthier than kibble but more convenient and affordable than fresh food, I couldn’t find it. So I joined a team to create it.</Paragraph>`,
      role: "Chief Science Officer & Chair of our Science\xa0Advisory\xa0Board",
    },
    feature: {
      science: {
        description: `
        <Heading>Made by vets</Heading>
        <Paragraph>Formulated by the country’s leading veterinary and canine experts to maximize the benefits for your bestie.</Paragraph>
        <Heading>Ingredients</Heading>
        <Paragraph>We use nothing but the best, natural ingredients so your dog can start each day feeling their best.</Paragraph>`,
        title: "Science-backed Nutrition For Your Dog",
      },
      taste: {
        description: `
        <Heading>Cooking process</Heading>
        <Paragraph>we air dry all the ingredients low-and-slow to lock in all the nutritious goodness. And we add absolutely zero unnecessary or unhealthy fillers, binders or synthetic ingredients afterwards.</Paragraph>
        <Heading>Taste</Heading>
        <Paragraph>We’ve taste tested our food on countless dogs (and humans) to make sure it’s tail-wagging tasty.</Paragraph>`,
        title: "Why Dogs Love Our Air-Dried Food",
      },
    },
    form: {
      error: "Something has gone wrong. Please try again later.",
    },
    header: {
      description: `
        <Intro>You’re 2 quick steps away from getting your hands on our brand new food…</Intro>
        <List>
          <ListItem>Watch the quick recorded message from Dr. Jamie Peyton (DVM, DACVECC), co-creator of our air-dried food explaining the next steps.</ListItem>
          <ListItem>Ready to confirm your order? We’ve saved all <b>{{ name }}</b>’s details, we just need to check they’re still correct - especially ${profilePronouns.their} weight. Hit the link below to confirm your order today.</ListItem>
        </List>`,
      title: "It’s here! Our air-dried food is ready for {{ name }}",
      video: "Watch the video",
    },
    ingredients: {
      title: "Organic Cage-Free Chicken Recipe",
    },
    meta: {
      title: "It’s here! Our air-dried food is ready for your bestie | FOTP",
    },
    productFeatures: {
      title: "Dog Food With Nothing To Hide",
    },
  });

  const uuid =
    typeof router.query.dog_profile === "string"
      ? router.query.dog_profile
      : null;

  const profile = useDogProfile(uuid);

  // Handle errors
  useEffect(() => {
    if (profile.error) {
      throw profile.error;
    }

    if (router.isReady && !uuid) {
      throw new Error("Missing dog profile UUID");
    }

    if (uuid && !profile.data?.dogProfile && !profile.loading) {
      throw new Error("Error loading dog profile data");
    }
  }, [profile, router, uuid]);

  const CTALink: FC<ComponentStyleProps> = ({ _css = {} }) => {
    if (!uuid) {
      throw new Error("Missing dog profile UUID");
    }

    return (
      <Link
        css={s(primaryButton(), _css)}
        to={`/food/plan/edit?dog_profile=${uuid}`}
      >
        {t("FoodEarlyAccessPage:cta")}
      </Link>
    );
  };

  return (
    <>
      <Metadata noindex title={t("FoodEarlyAccessPage:meta.title")} />
      <SalesFunnelHeader showContact={false} showLinks={false} />

      {profile.data?.dogProfile ? (
        <>
          <main
            css={s((t) => ({
              marginTop: [t.height?.nav.mobile, null, t.height?.nav.desktop],
            }))}
          >
            <header
              css={s(gutterBottom, gutterX, (t) => ({
                paddingTop: t.spacing.lg,
              }))}
            >
              <div css={s(belt, { maxWidth: [480, null, 1080] })}>
                <Grid
                  gx={(t) => [t.spacing.xl, null, null, t.spacing.xxxl]}
                  gy={(t) => t.spacing.xl}
                  innerCss={s({
                    alignItems: "center",
                    flexWrap: ["wrap", null, "nowrap"],
                  })}
                  itemWidth="100%"
                >
                  <Item _css={s({ flexGrow: 1, flexShrink: 1 })}>
                    <h1
                      css={s(headingAlpha, (t) => ({
                        marginBottom: [t.spacing.sm, null, t.spacing.md],
                      }))}
                    >
                      {t("FoodEarlyAccessPage:header.title", {
                        name: profile.data.dogProfile.name,
                      })}
                    </h1>
                    <Trans
                      components={{
                        Intro: (
                          <p css={s(bodyText, { fontSize: [18, null, 22] })} />
                        ),
                        List: (
                          <ol
                            css={s(bodyText, orderedList, (t) => ({
                              marginTop: t.spacing.xl,
                            }))}
                          />
                        ),
                        ListItem: (
                          <li
                            css={s(orderedListItem, (t) => ({
                              ":first-child": { marginTop: 0 },
                              marginTop: t.spacing.md,
                            }))}
                          />
                        ),
                      }}
                      i18nKey="FoodEarlyAccessPage:header.description"
                      values={{
                        name: profile.data.dogProfile.name,
                        sex: profile.data.dogProfile.sex,
                      }}
                    />
                    <CTALink
                      _css={s((t) => ({
                        display: ["none", null, "block"],
                        marginTop: t.spacing.xl,
                      }))}
                    />
                  </Item>
                  <Item _css={s({ flexGrow: 0, flexShrink: 1 })}>
                    <div css={s(belt, { maxWidth: [400, null, null, 475] })}>
                      <div
                        css={s(ratio(16 / 9), {
                          backgroundColor: "#d9c7a4",

                          width: "100%",
                        })}
                      >
                        <ResponsiveImage
                          alt=""
                          priority
                          layout="fill"
                          objectFit="contain"
                          src={JAMIE_VIDEO_POSTER_IMG.src}
                          sizes={{
                            maxWidth: [400, null, null, 475],
                            width: "100vw",
                          }}
                        />
                        <VimeoPlayer
                          _css={s(greedy)}
                          url="https://player.vimeo.com/video/672708791?h=8475670a34"
                        >
                          {({ isBusy }) => (
                            <div
                              css={s({
                                alignItems: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              })}
                            >
                              <div
                                css={s((t) => ({
                                  ...size([72, null, 80, 96]),
                                  alignItems: "center",
                                  backgroundColor: t.color.background.dark,
                                  borderRadius: 100,
                                  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
                                  color: t.color.background.base,
                                  display: "flex",
                                  justifyContent: "center",
                                  paddingLeft: t.spacing.xs,
                                  position: "relative",
                                }))}
                              >
                                <svg
                                  css={s({
                                    height: 24,
                                    opacity: isBusy ? 0 : 1,
                                    transform: [
                                      null,
                                      null,
                                      "scale(1.1)",
                                      "scale(1.33)",
                                    ],
                                    transition: "opacity 500ms",
                                    width: 20,
                                  })}
                                  viewBox="0 0 27 32"
                                >
                                  <path
                                    d="M27 16L-1.4682e-06 31.5885L-1.05412e-07 0.411542L27 16Z"
                                    fill="currentColor"
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
                              <span
                                css={s(headingBravo, (t) => ({
                                  color: t.color.text.light.base,
                                  marginTop: t.spacing.md,
                                  textShadow: "0 0 16px black",
                                }))}
                              >
                                {t("FoodEarlyAccessPage:header.video")}
                              </span>
                            </div>
                          )}
                        </VimeoPlayer>
                      </div>
                      <CTALink
                        _css={s((t) => ({
                          display: ["block", null, "none"],
                          marginTop: t.spacing.xl,
                        }))}
                      />
                    </div>
                  </Item>
                </Grid>
              </div>
            </header>
            {data.cms.product?.otherIngredients && (
              <section
                css={s(gutter, (t) => ({
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 250%)",
                  color: t.color.text.light.base,
                  position: "relative",
                  textAlign: "center",
                  textShadow: `0 0 16px black`,
                }))}
              >
                <div css={s(belt, { maxWidth: 960 })}>
                  <h2 css={s(headingAlpha)}>
                    {t("FoodEarlyAccessPage:ingredients.title")}
                  </h2>
                  <p
                    css={s(headingCharlie, (t) => ({
                      fontSize: [20, null, 24],
                      marginTop: t.spacing.xl,
                      ...px([t.spacing.md, null, 0]),
                    }))}
                  >
                    <RichTextFragment
                      render={data.cms.product.otherIngredients}
                    />
                  </p>
                  <CTALink
                    _css={s((t) => ({
                      marginTop: t.spacing.xl,
                      textShadow: "none",
                    }))}
                  />
                </div>
                <div css={s(greedy, { backgroundColor: "black", zIndex: -1 })}>
                  <div css={s({ opacity: 0.7 })}>
                    <div css={s({ display: [null, null, "none"] })}>
                      <ResponsiveImage
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={60}
                        sizes="100vw"
                        src={HERO_MOBILE_IMG.src}
                      />
                    </div>
                    <div css={s({ display: ["none", null, "block"] })}>
                      <ResponsiveImage
                        alt=""
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={60}
                        sizes="100vw"
                        src={HERO_IMG.src}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}
            <section css={s(gutter, { textAlign: "center" })}>
              <div css={s(belt)}>
                <h2 css={s(headingAlpha)}>
                  {t("FoodEarlyAccessPage:productFeatures.title")}
                </h2>
                <ProductFeaturesFood
                  _css={s((t) => ({ marginTop: t.spacing.xl }))}
                />
              </div>
            </section>
            {[
              { image: FOOD_NATURAL_IMG, key: "science" },
              { image: FOOD_TASTY_IMG, key: "taste" },
            ].map(({ image, key }, index) => (
              <section key={key} css={s(gutterBottom)}>
                <FeatureLayout
                  direction={index % 2 ? "rtl" : "ltr"}
                  height={[null, null, 500, 600, 640]}
                  image={image}
                >
                  <h2 css={s(headingAlpha)}>
                    {t(`FoodEarlyAccessPage:feature.${key}.title`)}
                  </h2>
                  <Trans
                    components={{
                      Heading: (
                        <h3
                          css={s(headingDelta, (t) => ({
                            marginTop: [t.spacing.lg, null, t.spacing.xl],
                          }))}
                        />
                      ),
                      Paragraph: (
                        <p css={s((t) => ({ marginTop: t.spacing.lg }))} />
                      ),
                    }}
                    i18nKey={`FoodEarlyAccessPage:feature.${key}.description`}
                  />
                </FeatureLayout>
              </section>
            ))}
            <aside
              css={s(gutter, (t) => ({
                color: t.color.text.light.base,
                position: "relative",
                textShadow: `0 0 8px ${t.color.background.dark}`,
              }))}
            >
              <div
                css={s(belt, {
                  alignItems: "stretch",
                  display: [null, null, "flex"],
                  maxWidth: [480, null, 960],
                  width: "100%",
                })}
              >
                <div
                  css={s({
                    position: "relative",
                    ...mx("auto"),
                    height: [200, 240, "auto"],
                    width: [200, 240, "100%"],
                  })}
                >
                  <ResponsiveImage
                    _css={s((t) => ({
                      borderRadius: [t.radius.xxl, null, 0],
                    }))}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes={{
                      width: "100vw", // TODO: update with real values
                    }}
                    src={EXPERT_JAMIE_IMG.src}
                  />
                </div>
                <figure
                  css={s((t) => ({
                    marginLeft: [null, null, t.spacing.xl, t.spacing.xxl],
                    marginTop: [t.spacing.lg, null, 0],
                    maxWidth: [null, null, "50%"],
                    ...py([null, null, t.spacing.md, t.spacing.lg]),
                  }))}
                >
                  <figcaption css={s({ textAlign: ["center", null, "left"] })}>
                    <h2 css={s(headingCharlie)}>
                      {t("FoodEarlyAccessPage:expert.name")}
                    </h2>
                    <p
                      css={s((t) => ({
                        fontFamily: t.font.secondary.family,
                        fontStyle: "italic",
                        fontWeight: t.font.secondary.weight.book,
                        marginTop: t.spacing.xs,
                      }))}
                    >
                      {t("FoodEarlyAccessPage:expert.role")}
                    </p>
                  </figcaption>
                  <blockquote
                    css={s(bodyText, (t) => ({
                      marginTop: [t.spacing.lg, null, t.spacing.xl],
                    }))}
                  >
                    <Trans
                      components={{
                        Paragraph: (
                          <p
                            css={s((t) => ({
                              "&:first-child": {
                                "&:before": {
                                  content: "'“'",
                                },
                                marginTop: 0,
                              },
                              "&:last-child": {
                                "&:after": {
                                  content: "'”'",
                                },
                              },
                              marginTop: t.spacing.sm,
                            }))}
                          />
                        ),
                      }}
                      i18nKey="FoodEarlyAccessPage:expert.quote"
                    />
                  </blockquote>
                </figure>
              </div>
              <div
                css={s(greedy, (t) => ({
                  backgroundColor: t.color.background.dark,
                  overflow: "hidden",
                  zIndex: -1,
                }))}
              >
                {[
                  {
                    left: ["25%", null, "40%"],
                    marginLeft: [-175, null, -240],
                    transform: [
                      "rotate(180deg) translate(40px, 250px)",
                      null,
                      "translate(-440px, 360px)",
                      "translate(-600px, 90px)",
                    ],
                  },
                  {
                    marginRight: [-175, null, -240],
                    right: ["25%", null, "40%"],
                    transform: [
                      "translate(40px, 250px)",
                      null,
                      "rotate(180deg) translate(-440px, 360px)",
                      "rotate(180deg) translate(-600px, 90px)",
                    ],
                  },
                ].map((styles, index) => (
                  <div
                    key={index}
                    css={s(
                      {
                        marginTop: [-215, -250, -345],
                        position: "absolute",
                        top: "50%",
                        width: [300, 350, 480],
                      },
                      styles
                    )}
                  >
                    <ResponsiveImage
                      {...ASHWAGANDHA_IMG}
                      alt=""
                      sizes={{ width: [300, 350, 480] }}
                    />
                  </div>
                ))}
                <div
                  css={s(greedy, (t) => ({
                    backgroundImage: [
                      { max: 0.6, min: 0.5 },
                      null,
                      null,
                      { max: 0.4, min: 0.3 },
                    ].map((value) =>
                      value && typeof value === "object"
                        ? `radial-gradient(circle, ${rgba(
                            t.color.background.dark,
                            value.min
                          )} 0%, ${rgba(
                            t.color.background.dark,
                            value.max
                          )} 40%,  ${rgba(
                            t.color.background.dark,
                            value.max
                          )} 60%, ${rgba(
                            t.color.background.dark,
                            value.min
                          )} 100%)`
                        : value
                    ),
                  }))}
                />
              </div>
            </aside>
            <section css={s(gutter)}>
              <div css={s(belt, { maxWidth: [400, null, 1280] })}>
                <Grid
                  gx={(t) => t.spacing.md}
                  gy={(t) => t.spacing.xl}
                  innerCss={s({ alignItems: "center" })}
                  itemWidth={["100%", null, "50%"]}
                >
                  <Item>
                    <div css={s({ maxWidth: 400 })}>
                      <h2 css={s(visuallyHidden)}>
                        {t("FoodEarlyAccessPage:blindTasting.title")}
                      </h2>
                      <p css={s(headingAlpha)}>
                        {t("FoodEarlyAccessPage:blindTasting.description")}
                      </p>
                      <CTALink
                        _css={s((t) => ({
                          display: ["none", null, "block"],
                          marginTop: t.spacing.xl,
                        }))}
                      />
                    </div>
                  </Item>
                  <Item>
                    <div
                      css={s(ratio(1), (t) => ({
                        backgroundColor: t.color.background.feature6,
                      }))}
                    >
                      <InView rootMargin="50%">
                        {({ inView, ref }) => (
                          <figure ref={ref}>
                            {inView && (
                              <CloudinaryUploadedAnimation
                                publicId="/food/BLIND_TASTING_SQUARE"
                                type={CloudinaryMedia.VIDEO}
                                version="v1643802803"
                              />
                            )}
                            <figcaption css={s(visuallyHidden)}>
                              {t("FoodEarlyAccessPage:blindTasting.alt")}
                            </figcaption>
                          </figure>
                        )}
                      </InView>
                    </div>
                  </Item>
                </Grid>
                <CTALink
                  _css={s((t) => ({
                    display: ["block", null, "none"],
                    marginTop: t.spacing.xl,
                  }))}
                />
              </div>
            </section>
            <aside
              css={s(gutterX, (t) => ({
                position: "relative",
                ...py(t.spacing.xxxl),
                textAlign: "center",
                textShadow: `0 0 8px ${t.color.background.feature4}`,
              }))}
            >
              <div css={s(belt, { maxWidth: [480, null, 740] })}>
                <h2 css={s(visuallyHidden)}>
                  {t("FoodEarlyAccessPage:confirm.title")}
                </h2>
                <p
                  css={s(headingBravo, (t) => px([t.spacing.lg, t.spacing.xl]))}
                >
                  {t("FoodEarlyAccessPage:confirm.description")}
                </p>
                <CTALink
                  _css={s((t) => ({
                    marginTop: t.spacing.xl,
                    textShadow: "none",
                  }))}
                />
              </div>
              <div
                css={s(greedy, (t) => ({
                  backgroundColor: t.color.background.feature4,
                  overflow: "hidden",
                  zIndex: -1,
                }))}
              >
                {[
                  {
                    left: ["25%", null, "40%"],
                    marginLeft: [-175, null, -240],
                    transform: [
                      "rotate(180deg) translate(-20px, 250px)",
                      null,
                      "translate(-440px, 360px)",
                      "translate(-520px, 120px)",
                    ],
                  },
                  {
                    marginRight: [-175, null, -240],
                    right: ["25%", null, "40%"],
                    transform: [
                      "translate(-20px, 250px)",
                      null,
                      "rotate(180deg) translate(-440px, 360px)",
                      "rotate(180deg) translate(-520px, 120px)",
                    ],
                  },
                ].map((styles, index) => (
                  <div
                    key={index}
                    css={s(
                      {
                        marginTop: [-215, -250, -345],
                        position: "absolute",
                        top: "50%",
                        width: [300, 350, 480],
                      },
                      styles
                    )}
                  >
                    <ResponsiveImage
                      {...ASHWAGANDHA_IMG}
                      alt=""
                      sizes={{ width: [300, 350, 480] }}
                    />
                  </div>
                ))}
                <div
                  css={s(greedy, (t) => ({
                    backgroundImage: [
                      { max: 0.7, min: 0.6 },
                      { max: 0.6, min: 0.4 },
                      { max: 0.4, min: 0.2 },
                      { max: 0.3, min: 0.1 },
                    ].map((value) =>
                      value && typeof value === "object"
                        ? `radial-gradient(circle, ${rgba(
                            t.color.background.feature4,
                            value.min
                          )} 0%, ${rgba(
                            t.color.background.feature4,
                            value.max
                          )} 40%,  ${rgba(
                            t.color.background.feature4,
                            value.max
                          )} 60%, ${rgba(
                            t.color.background.feature4,
                            value.min
                          )} 100%)`
                        : value
                    ),
                  }))}
                />
              </div>
            </aside>
          </main>
          <Footer />
        </>
      ) : (
        <PageSpinner label={t("common:loading")} />
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: [{ params: { handle: "chicken" } }],
  };
};

export const getStaticProps = makeProductPageStaticPropsGetter();

export default FoodEarlyAccessPage;
