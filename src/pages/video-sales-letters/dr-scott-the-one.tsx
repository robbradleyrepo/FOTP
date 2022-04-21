import useGoogleOptimize from "@react-hook/google-optimize";
import { captureException } from "@sentry/nextjs";
import { dataLayerTrack } from "@sss/analytics";
import { runServerSideQuery } from "@sss/apollo";
import { ProductSchema } from "@sss/ecommerce";
import { getProductComputedMetadata } from "@sss/ecommerce/product";
import { useDateTimeFormatter, useLocale } from "@sss/i18n";
import { Link as NavigationLink } from "@sss/next";
import {
  Elements,
  LinkResolver as PrismicLinkResolver,
  renderAsString,
  RichTextFragment,
} from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import Cookies from "js-cookie";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, {
  AnchorHTMLAttributes,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Trans } from "react-i18next";
import { Link as ScrollLink } from "react-scroll";
import store from "store/dist/store.modern";

import {
  belt,
  ComponentStyleProps,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  link,
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

import CONTENTS_IMG from "../../assets/images/videos/the-one/contents.jpg";
import DR_SCOTT_IMG from "../../assets/images/videos/the-one/dr-scott.jpg";
import { RichText, RichTextProps } from "../../cms/prismic";
import {
  makeProductPageStaticPropsGetter,
  ProductPageDataProvider,
  UnifiedProductPageData,
} from "../../cms/product-page";
import {
  AdditionalContent,
  BundlePickerDisplayType,
  VideoSalesLetterData,
  VideoSalesLetterLayoutType,
} from "../../cms/video-sales-letter";
import Accordion from "../../ui/base/accordion";
import { contrastButton } from "../../ui/base/button";
import { Grid, Item } from "../../ui/base/grid";
import ResponsiveImage from "../../ui/base/responsive-image";
import Spinner from "../../ui/base/spinner";
import { ToastRack } from "../../ui/base/toast";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingDelta,
} from "../../ui/base/typography";
import paw from "../../ui/icons/paw";
import BundlePicker from "../../ui/modules/offers/bundle-picker";
import TheOneBundlePicker from "../../ui/modules/offers/the-one-bundle-picker";
import Footer from "../../ui/modules/video-sales-letter/footer";
import Nav, { getNavEnabled } from "../../ui/modules/video-sales-letter/nav";
import { dataUriFromPath } from "../../ui/styles/utils";

const motionProps: HTMLMotionProps<"div"> = {
  animate: { opacity: 1 },
  exit: { opacity: 0, position: "absolute" },
  transition: { duration: 1 },
};

const enUsResource = {
  discover: {
    list: {
      item0:
        "One 10 second “at-home” tweak to your dog’s diet that’s practically guaranteed to help them live longer.",
      item1:
        "How it doesn’t matter what type of food you feed your dog, every single type have the same problem.",
      item2:
        "How, regardless of your dog’s age, weight or breed you you can make them feel healthier and thrive.",
      item3:
        "The 5 “Danger Foods” that all pet owners should never, ever feed their dogs.",
    },
    title: "In this video, you will discover…",
  },
  faqs: {
    extra: "Can’t find what you need? <Link>View All FAQ’s</Link>",
    title: "Frequently asked questions",
  },
  featuredTopics: {
    expert:
      "<Highlight>Dr Scott Miller</Highlight> has 22 years experience as a Veterinary Surgeon.",
    list: {
      item0:
        "One surprising thing you can do at home to help your dog live longer.",
      item1:
        "How dog food companies have been getting away with murder for years.",
      item2:
        "The 5 “Danger Foods” that all pet owners should never, ever feed their dogs.",
    },
    title: "Featured topics",
  },
  header: {
    category: {
      label: "Category",
      value: "Dog Health",
    },
    publishedOn: {
      label: "Published on",
    },
    title:
      "How 12 clinically proven ingredients can keep your dog healthy and active as they age",
    video: {
      play: "Click to play",
    },
  },
  meta: {
    description:
      "Regardless of your dog’s age, weight or breed, whatever food you feed your dog, every single type have the same problem…",
    openGraph: {
      description:
        "Regardless of your dog’s age, weight or breed, whatever food you feed your dog, every single type have the same problem…",
      title: "Discover 1 Simple Tweak To Supercharge Your Dog’s Health",
    },
    title: "Discover 1 Simple Tweak To Supercharge Your Dog’s Health  | FOTP",
  },
  orderNow: "Order now",
  references: {
    title: "Scientific references",
  },
  theOne: {
    description:
      "This formula combines 12 clinically proven ingredients to give your dog the added nutrition they need to fight the 8 most common and often preventable canine health concerns, helping them to live a long, healthy life.",
    list: {
      item0: "Made in the USA with 100% clinically proven ingredients",
      item1:
        "Vet recommended and backed up by a 90 day “no questions asked” guarantee",
      item2:
        "No nasties – Non-GMO & pesticide-free, no chicken, no grain, hypoallergenic and gluten-free",
      item3:
        "Supports higher energy levels, easier digestion, joint and coat support, strong brain health and anxiety levels",
    },
    title: "Front of the Pack – <Highlight>The One</Highlight>",
  },
  transcript: {
    title: "Transcript",
  },
};

const ACCRUED_STORAGE_KEY = "vsl:the_one.dr_scott.accrued";
const POSITION_STORAGE_KEY = "vsl:the_one.dr_scott.position";
const DEFAULT_THRESHOLD = 27 * 60 + 49;
const DEFAULT_VIDEO_ID = "1uZvSJ3wHuij7LVI";
const EXPOSED_CALLBACK_OBJECT_KEY = "__fotp_VidalyticsPlayer";

type VidalyticsAddRemoveEventHandler = (
  event: VidalyticsEvents | string,
  cb: () => void
) => void;

interface VindalyticsEmbed {
  player: UninitializedVidalyticsPlayer | VidalyticsPlayer;
}

enum VidalyticsEvents {
  onFullscreenEnter = "onFullscreenEnter",
  onPaused = "onPaused",
  onPlay = "onPlay",
  onPlaybackFinished = "onPlaybackFinished",
  onTimeChanged = "onTimeChanged",
}

interface UninitializedVidalyticsPlayer {
  getCurrentVideoTime: () => number;
  pause: () => void;
  play: () => void;
  seekTo: (t: number) => void;
}

interface VidalyticsPlayer extends UninitializedVidalyticsPlayer {
  _player: {
    addEventHandler: VidalyticsAddRemoveEventHandler;
    removeEventHandler: VidalyticsAddRemoveEventHandler;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    [EXPOSED_CALLBACK_OBJECT_KEY]?: Record<string, () => void>;
    _vidalytics?: {
      embeds?: Record<string, VindalyticsEmbed>;
    };
  }
}

const parseIntWithFallback = (input: unknown, fallback: number) => {
  let output = input;

  if (typeof output === "string") {
    output = parseInt(output, 10);
  }

  return typeof output !== "number" || isNaN(output) ? fallback : output;
};

const useVidalytics = (id: string) => {
  const [player, setPlayer] = useState<VidalyticsPlayer | null>(null);
  const Player = useMemo(
    () =>
      function Player({ _css = {} }: ComponentStyleProps) {
        const embedId = `vidalytics_embed_${id}`;

        useEffect(() => {
          if (typeof window !== "undefined") {
            let timerId: number;

            const updatePlayer = () => {
              const player = window?._vidalytics?.embeds?.[embedId]?.player;

              if (!player) {
                setPlayer(null);

                return;
              } else if ("_player" in player) {
                setPlayer(player);

                return;
              }

              // Some Android phones don't initialise the player completely
              // before our callback fires, so we'll need to poll until the
              // `_player` property is set
              timerId = window.setTimeout(updatePlayer, 1000);
            };

            // The player is already ready
            if (window?._vidalytics?.embeds?.[embedId]?.player) {
              updatePlayer();

              return;
            }

            // Use a globally exposed callback if the video isn't ready
            const callbacks = window[EXPOSED_CALLBACK_OBJECT_KEY] ?? {};

            const cleanup = () => {
              window.clearTimeout(timerId);

              if (callbacks[embedId]) {
                delete callbacks[embedId];
              }
            };
            const callback = () => {
              cleanup();
              updatePlayer();
            };

            callbacks[embedId] = callback;

            window[EXPOSED_CALLBACK_OBJECT_KEY] = callbacks;

            return cleanup;
          }
        }, [embedId]);

        return (
          <div
            css={s(
              ratio(9 / 16),
              (t) => ({
                backgroundColor: t.color.background.dark,
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.6) 100%, rgba(0,0,0,1) 200%)",
                width: "100%",
              }),
              _css
            )}
          >
            <Spinner
              _css={s({
                height: percentage(1 / 3),
                width: percentage((1 / 3) * (9 / 16)),
              })}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: `<div id="${embedId}" style="width: 100%; position:relative;"></div>
        <script type="text/javascript">
        (function (v, i, d, a, l, y, t, c, s) {
            y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
            if (!vsl){vsl=function(u,cb){
                if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
                if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
                i.getElementsByTagName("head")[0].appendChild(s);
            };}
            vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);${
              // Add our own callback
              `var f="${EXPOSED_CALLBACK_OBJECT_KEY}";v[f]&&v[f][a]&&v[f][a]();`
            }});});
        })(window, document, 'Vidalytics', '${embedId}', 'https://quick.vidalytics.com/embeds/${
                  process.env.VIDALYTICS_CUSTOMER_ID
                }/${id}/');
        </script>`,
              }}
              suppressHydrationWarning
            />
          </div>
        );
      },
    [id]
  );

  return { Player, player };
};

const useVideoSalesLetter = (id: string, threshold: number) => {
  const [completed, setCompleted] = useState(false);
  const { Player, player } = useVidalytics(id);

  const handleAccruedUpdate = useCallback(
    (interval: number) => {
      const seconds: number =
        parseIntWithFallback(store.get(ACCRUED_STORAGE_KEY), 0) + interval;

      store.set(ACCRUED_STORAGE_KEY, seconds);

      if (seconds >= threshold) {
        setCompleted(true);
      }
    },
    [setCompleted, threshold]
  );

  const handlePositionUpdate = useCallback(
    (seconds: number) => {
      store.set(POSITION_STORAGE_KEY, seconds);

      if (seconds >= threshold) {
        setCompleted(true);
      }
    },
    [setCompleted, threshold]
  );

  useEffect(() => {
    const UPDATE_INTERVAL = 1;
    const handleInterval = () => handleAccruedUpdate(UPDATE_INTERVAL);

    const timerId = setInterval(handleInterval, UPDATE_INTERVAL * 1000);

    return () => clearInterval(timerId);
  }, [handleAccruedUpdate]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const handleTimeupdate = () => {
      const position = player.getCurrentVideoTime();

      if (position) {
        handlePositionUpdate(position);
      }

      /*
      A workaround for Vidalytics conversion tracking

      Vidalytics relies on storage for conversion tracking, our Shopify checkout
      is on a subdomain so it cannot share the conversion tracking value. So we're
      persisting the value to a cookie. In GTM prior to calling the conversion tracking
      script, we set the storage value to the cookie value
      */
      const storageValue =
        localStorage.getItem("vidalytics_uid") ??
        sessionStorage.getItem("vidalytics_uid");
      const cookieValue = Cookies.get("vidalytics_uid");

      if (storageValue && storageValue !== cookieValue) {
        Cookies.set("vidalytics_uid", storageValue, { expires: 30 });
      }
    };

    try {
      player._player.addEventHandler(
        VidalyticsEvents.onTimeChanged,
        handleTimeupdate
      );
    } catch (error) {
      captureException(error);
    }

    return () => {
      try {
        player._player.removeEventHandler(
          VidalyticsEvents.onTimeChanged,
          handleTimeupdate
        );
      } catch (error) {
        captureException(error);
      }
    };
  }, [handlePositionUpdate, player]);

  return { Player, completed };
};

const dlItemStyle = {
  display: "inline-block",
};

enum GoogleOptimizeVariant {
  ALTERNATIVE = "ALTERNATIVE",
  ORIGINAL = "ORIGINAL",
}

interface VideoDrScottTheOneProps {
  data: UnifiedProductPageData &
    VideoSalesLetterData &
    Record<"vidalytics", { id: string }>;
}

export const VideoDrScottTheOne: FC<VideoDrScottTheOneProps> = ({ data }) => {
  const formatDateTime = useDateTimeFormatter();
  const googleOptimizeVariant = useGoogleOptimize(
    "LyOrh2YTTyC2sat6G-aD5A", // https://optimize.google.com/optimize/home/#/accounts/4703495009/containers/13785524/experiments/194
    [GoogleOptimizeVariant.ORIGINAL, GoogleOptimizeVariant.ALTERNATIVE],
    4000 // Timeout after 4 seconds to prevent delayed UI changes
  );
  const { i18n, locale, t } = useLocale();
  const router = useRouter();
  const [showBundleFromClick, setShowBundleFromClick] = useState(false);
  const theme = useTheme();

  const meta = getProductComputedMetadata(data.ecommerce, router.query, locale);

  const hasTwoStepBundlePicker =
    (googleOptimizeVariant === GoogleOptimizeVariant.ALTERNATIVE ||
      router.query.picker === "alternative") &&
    !(
      meta.subscription.hasSubscription && meta.subscription.isSubscriptionOnly
    );

  i18n.addResourceBundle("en-US", "VideoDrScottTheOne", enUsResource);

  const { id } = data.vidalytics;

  const {
    additionalContent,
    bundlePickerDelay: bundlePickerDelayOverride,
    bundlePickerDisplayType,
    customPageTitle,
    faqs,
    layout,
    publishedOn,
    references,
  } = data.videoSalesLetter;

  const navEnabled =
    layout === VideoSalesLetterLayoutType.FULLSCREEN
      ? false
      : getNavEnabled(data.videoSalesLetter);

  const bundlePickerDelay = parseIntWithFallback(
    // We're using window rather than `router.query` here as the `query` value is stale
    // when the `vsl_page_viewed` analytics event fires. I've tried using `router.events`
    // and only firing once route change is complete but this is still early. Cleaner
    // to ignore the Next Router and use the browser data.
    new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    ).get("threshold"),
    bundlePickerDelayOverride ?? DEFAULT_THRESHOLD
  );

  const bundlePickerProps = {
    skus: ["FPTO01-PHx6", "FPTO01-PHx3", "FPTO01-PH"],
    trackingSource: "vsl-dr-scott-the-one",
  };

  useEffect(() => {
    dataLayerTrack({
      delay: bundlePickerDelay,
      event: "vsl_page_viewed",
      handle: data.videoSalesLetter._meta.uid,
      path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
      video: id,
    });
  }, [bundlePickerDelay, data, id]);

  const { Player, completed } = useVideoSalesLetter(id, bundlePickerDelay);

  const FaqRichText = useMemo(() => {
    const external: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
      <a css={s(link)} {...props} />
    );
    const internal: typeof NavigationLink = ({
      children,
      className,
      to,
      ...rest
    }) => {
      return to.startsWith("/videos/") && to.endsWith("#bundles") ? (
        <ScrollLink
          css={s(contrastButton())}
          className={className}
          duration={500}
          href={to}
          onClick={() => setShowBundleFromClick(true)}
          smooth={true}
          to="bundles"
        >
          {children}
        </ScrollLink>
      ) : (
        <NavigationLink {...rest} className={className} to={to}>
          {children}
        </NavigationLink>
      );
    };

    const LinkResolver: typeof PrismicLinkResolver = (props) => (
      <PrismicLinkResolver components={{ external, internal }} {...props} />
    );

    const defaultFaqRichTextComponents = {
      [Elements.hyperlink]: <LinkResolver />,
    };

    const FaqRichText: FC<RichTextProps> = ({ components, render }) => (
      <RichText
        components={{ ...defaultFaqRichTextComponents, ...components }}
        render={render}
      />
    );

    return FaqRichText;
  }, []);

  const scrollOffset = s((t) => ({
    bottom:
      layout !== VideoSalesLetterLayoutType.FULLSCREEN
        ? [
            t.height.nav.mobile + t.spacing.xl,
            null,
            t.height.nav.desktop + t.spacing.xxl,
          ]
        : null,
    position: "relative",
  }));

  const showBundleFromThreshold =
    bundlePickerDisplayType === BundlePickerDisplayType.DELAY && completed;
  const isBundlePickerVisible = showBundleFromClick || showBundleFromThreshold;

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <Metadata
        description={t("VideoDrScottTheOne:meta.description")}
        title={t("VideoDrScottTheOne:meta.title")}
        openGraph={{
          description: t("VideoDrScottTheOne:meta.openGraph.description"),
          image: CONTENTS_IMG.src,
          title: t("VideoDrScottTheOne:meta.openGraph.title"),
        }}
      />

      {navEnabled && (
        <Nav
          _css={s({ left: 0, position: "fixed", top: 0, width: "100%" })}
          {...data.videoSalesLetter}
        />
      )}

      <main
        css={s((t) => ({
          paddingTop: navEnabled
            ? [t.height.nav.mobile, null, t.height.nav.desktop]
            : null,
        }))}
      >
        {layout === VideoSalesLetterLayoutType.FULLSCREEN ? (
          <>
            <header
              css={s((t) => ({
                backgroundColor: t.color.background.dark,
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.6) 100%, rgba(0,0,0,1) 200%)",
                width: "100%",
              }))}
            >
              <h1 css={s(visuallyHidden)}>
                {customPageTitle && renderAsString(customPageTitle) ? (
                  <RichTextFragment render={customPageTitle} />
                ) : (
                  <>{t("VideoDrScottTheOne:header.title")}</>
                )}
              </h1>
              <div
                css={s({
                  "@media (orientation: portrait)": {
                    // iOS doesn't handle 100vh very well, so we'll limit the
                    // height on portrait devices to avoid the video being
                    // positioned off-centre
                    maxHeight: "-webkit-fill-available",
                  },
                  alignItems: "center",
                  display: "flex",
                  height: "100vh",
                  margin: "auto",
                  maxWidth: `${(100 * 16) / 9}vh`,
                  width: "100%",
                })}
              >
                <Player _css={s({ background: "none" })} />
              </div>
            </header>
            <div css={s(scrollOffset)} id="bundles" />
            <section css={s(bodyText, gutter, { textAlign: "center" })}>
              <div css={s(belt, { position: "relative" })}>
                <AnimatePresence>
                  {isBundlePickerVisible ? (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0 }}
                      {...motionProps}
                    >
                      {hasTwoStepBundlePicker ? (
                        <TheOneBundlePicker {...bundlePickerProps} />
                      ) : (
                        <BundlePicker {...bundlePickerProps} />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="incomplete"
                      css={s(belt, { width: "100%" })}
                      initial={{ opacity: 1 }}
                      {...motionProps}
                    >
                      {bundlePickerDisplayType ===
                        BundlePickerDisplayType.CLICK && (
                        <button
                          css={s(contrastButton(), (t) => ({
                            marginBottom: [
                              t.spacing.xl,
                              null,
                              null,
                              t.spacing.xxl,
                            ],
                          }))}
                          onClick={() => setShowBundleFromClick(true)}
                        >
                          {t("VideoDrScottTheOne:orderNow")}
                        </button>
                      )}
                      <h2
                        css={s(headingBravo, (t) => ({
                          marginBottom: [
                            t.spacing.xl,
                            null,
                            null,
                            t.spacing.xxl,
                          ],
                        }))}
                      >
                        {t("VideoDrScottTheOne:discover.title")}
                      </h2>
                      <Grid
                        itemWidth={[
                          percentage(1),
                          null,
                          percentage(1 / 2),
                          percentage(1 / 4),
                        ]}
                        gx={theme.spacing.xl}
                        gy={[theme.spacing.lg, null, theme.spacing.xl]}
                      >
                        {[...Array(4)].map((_, index) => (
                          <Item key={index}>
                            <p
                              css={s(belt, (t) => ({
                                "&:before": {
                                  content: `url(${dataUriFromPath({
                                    fill: t.color.tint.pistachio,
                                    path: paw,
                                  })})`,
                                  display: "block",
                                  marginBottom: [
                                    t.spacing.sm,
                                    null,
                                    t.spacing.md,
                                    t.spacing.lg,
                                  ],
                                  ...mx("auto"),
                                  ...size([32, null, 36]),
                                },
                                maxWidth: 400,
                                position: "relative",
                              }))}
                            >
                              {t(
                                `VideoDrScottTheOne:discover.list.item${index}`
                              )}
                            </p>
                          </Item>
                        ))}
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </>
        ) : (
          <>
            <header
              css={s(gutterBottom, (t) => ({
                "@media(min-height: 820px)": {
                  paddingTop: t.spacing.lg,
                },
                ...px([null, null, null, t.spacing.xl, t.spacing.xxl]),
                paddingTop: t.spacing.sm,
              }))}
            >
              <div
                css={s(belt, {
                  "@media(min-height: 720px)": {
                    maxWidth: 1140,
                  },
                  "@media(min-height: 800px)": {
                    maxWidth: 1280,
                  },
                  display: [null, null, null, "flex"],
                  flexDirection: "row-reverse",
                  maxWidth: [null, null, null, 1080],
                })}
              >
                <div css={s({ width: "100%" })}>
                  <header
                    css={s((t) => ({
                      marginBottom: [t.spacing.lg, null, null, t.spacing.md],
                      textAlign: ["center", null, null, "left"],
                    }))}
                  >
                    <h1
                      css={s(headingAlpha, (t) => ({
                        fontSize: [22, null, 32, 36], // Charlie for first breakpoint, Bravo for the rest
                        lineHeight: ["28px", null, "36px", "44px"], // Charlie for first breakpoint, Bravo for the rest
                        marginTop: [null, null, null, -8], // Compensate for half-leading
                        ...px([t.spacing.md, null, null, 0]),
                      }))}
                    >
                      {customPageTitle && renderAsString(customPageTitle) ? (
                        <RichTextFragment render={customPageTitle} />
                      ) : (
                        <>{t("VideoDrScottTheOne:header.title")}</>
                      )}
                    </h1>
                    <dl
                      css={s(bodyText, (t) => ({
                        display: ["none", null, null, "block"],
                        marginTop: t.spacing.sm,
                      }))}
                    >
                      <div css={s(dlItemStyle)}>
                        <dt css={s(dlItemStyle)}>
                          {t("VideoDrScottTheOne:header.category.label")}:{" "}
                        </dt>
                        <dd
                          css={s(dlItemStyle, (t) => ({
                            fontWeight: t.font.primary.weight.medium,
                            marginLeft: "0.2em",
                          }))}
                        >
                          {t("VideoDrScottTheOne:header.category.value")}
                        </dd>
                      </div>
                      {publishedOn && (
                        <div
                          css={s(dlItemStyle, {
                            "&:before": {
                              content: '"|"',
                              display: "inline-block",
                              ...mx("1em"),
                            },
                          })}
                        >
                          <dt css={s(visuallyHidden)}>
                            {t("VideoDrScottTheOne:header.publishedOn.label")}:{" "}
                          </dt>
                          <dd css={s(dlItemStyle)}>
                            {formatDateTime(publishedOn, {
                              day: "numeric",
                              month: "long",
                              timeZone: "UTC", // Dates without times are parsed as UTC midnight
                              year: "numeric",
                            })}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </header>
                  <Player />
                </div>
                <aside
                  css={s(belt, (t) => ({
                    flexShrink: 0,
                    marginRight: [null, null, null, t.spacing.xxl],
                    marginTop: 0,
                    maxWidth: [480, null, null, 300],
                    ...px([t.spacing.md, null, null, 0]),
                    paddingTop: [t.spacing.xxl, null, null, 0],
                    width: ["100%", null, null, percentage(1 / 4)],
                  }))}
                >
                  <h2
                    css={s(headingDelta, (t) => ({
                      backgroundColor: t.color.background.dark,
                      color: t.color.text.light.base,
                      letterSpacing: 1,
                      ...py([t.spacing.xs, null, null, t.spacing.sm]),
                      textAlign: "center",
                      textTransform: "uppercase",
                    }))}
                  >
                    {t("VideoDrScottTheOne:featuredTopics.title")}
                  </h2>
                  <p css={s((t) => my(t.spacing.md))}>
                    <Trans
                      components={{
                        Highlight: (
                          <span
                            css={s((t) => ({
                              fontWeight: t.font.primary.weight.medium,
                            }))}
                          />
                        ),
                      }}
                      i18nKey="VideoDrScottTheOne:featuredTopics.expert"
                    />
                  </p>
                  <ResponsiveImage
                    alt=""
                    priority
                    sizes={{ width: 100 }}
                    src={DR_SCOTT_IMG}
                  />
                  <ul css={s((t) => ({ marginTop: t.spacing.sm }))}>
                    {[...Array(3)].map((_, index) => (
                      <li
                        key={index}
                        css={s((t) => ({
                          borderColor: t.color.border.light,
                          borderStyle: "solid",
                          borderWidth: index === 0 ? "1px 0" : "0 0 1px 0",
                          marginBottom: t.spacing.xs,
                          paddingBottom: t.spacing.xs,
                          paddingTop: index === 0 ? t.spacing.xs : null,
                        }))}
                      >
                        {t(
                          `VideoDrScottTheOne:featuredTopics.list.item${index}`
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </header>
            <div css={s(scrollOffset)} id="bundles" />
            <AnimatePresence>
              {isBundlePickerVisible && (
                <motion.section
                  key="complete"
                  css={s(bodyText, gutterBottom, gutterX, {
                    textAlign: "center",
                  })}
                  initial={{ opacity: 0 }}
                  {...motionProps}
                >
                  <div css={s(belt)}>
                    {hasTwoStepBundlePicker ? (
                      <TheOneBundlePicker {...bundlePickerProps} />
                    ) : (
                      <BundlePicker {...bundlePickerProps} />
                    )}
                  </div>
                </motion.section>
              )}
              {!isBundlePickerVisible &&
                bundlePickerDisplayType === BundlePickerDisplayType.CLICK && (
                  <motion.aside
                    key="incomplete"
                    css={s(bodyText, gutterBottom, gutterX, {
                      textAlign: "center",
                      width: "100%",
                    })}
                    initial={{ opacity: 1 }}
                    {...motionProps}
                  >
                    <div css={s(belt)}>
                      <button
                        css={s(contrastButton())}
                        onClick={() => setShowBundleFromClick(true)}
                      >
                        {t("VideoDrScottTheOne:orderNow")}
                      </button>
                    </div>
                  </motion.aside>
                )}
            </AnimatePresence>
          </>
        )}

        {additionalContent !== AdditionalContent.HIDE_ALL && (
          <>
            {faqs?.body?.map(
              (snippet, index) =>
                !!snippet?.fields?.length && (
                  <section
                    key={index}
                    css={s(gutter, (t) => ({
                      backgroundColor: t.color.background.feature3,
                    }))}
                  >
                    <div css={s(belt, { maxWidth: 845 })}>
                      <h2
                        css={s(headingAlpha, (t) => ({
                          marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                          textAlign: "center",
                        }))}
                      >
                        {t("VideoDrScottTheOne:faqs.title")}
                      </h2>
                      {snippet.fields.map(
                        ({
                          faq: {
                            _meta: { uid },
                            answer,
                            question,
                          },
                        }) =>
                          answer &&
                          question && (
                            <Accordion
                              key={uid}
                              id={`faq-${uid}`}
                              label={<RichTextFragment render={question} />}
                              labelAs="h3"
                            >
                              <div
                                css={s((t) => ({ marginBottom: t.spacing.md }))}
                              >
                                <FaqRichText render={answer} />
                              </div>
                            </Accordion>
                          )
                      )}
                      <p
                        css={s(bodyTextSmall, (t) => ({
                          marginTop: t.spacing.xl,
                        }))}
                      >
                        <Trans
                          components={{
                            Link: (
                              <NavigationLink
                                css={s(link, (t) => ({
                                  fontWeight: t.font.primary.weight.medium,
                                }))}
                                to="/help/faq"
                              />
                            ),
                          }}
                          i18nKey="VideoDrScottTheOne:faqs.extra"
                        />
                      </p>
                    </div>
                  </section>
                )
            )}

            <section
              css={s(gutter, {
                backgroundColor: "#bac3b9",
                position: "relative",
              })}
            >
              <div
                css={s(greedy, {
                  maxHeight: [null, null, 650],
                  zIndex: 0,
                })}
              >
                <ResponsiveImage
                  _css={s({
                    objectPosition: ["top", null, "center left"],
                    transform: ["translateX(-5%)", null, "translateX(50%)"],
                  })}
                  alt=""
                  layout="fill"
                  objectFit="contain"
                  sizes={{ width: ["100vw", null, 650 * (2536 / 2440)] }}
                  src={CONTENTS_IMG}
                />
              </div>
              <div
                css={s(belt, {
                  paddingTop: ["90%", null, 0],
                  position: "relative",
                })}
              >
                <div css={s({ maxWidth: 560, width: ["100%", null, "50%"] })}>
                  <h2
                    css={s(headingAlpha, (t) => ({
                      marginBottom: t.spacing.md,
                    }))}
                  >
                    <Trans
                      components={{
                        Highlight: (
                          <span
                            css={s((t) => ({
                              fontStyle: "italic",
                              fontWeight: t.font.secondary.weight.book,
                              whiteSpace: "nowrap",
                            }))}
                          />
                        ),
                      }}
                      i18nKey="VideoDrScottTheOne:theOne.title"
                    />
                  </h2>
                  <p
                    css={s((t) => ({
                      marginBottom: [t.spacing.lg, null, t.spacing.xl],
                    }))}
                  >
                    {t("VideoDrScottTheOne:theOne.description")}
                  </p>
                </div>
                <ul css={s({ maxWidth: 520, width: ["100%", null, "65%"] })}>
                  {[...Array(4)].map((_, index) => (
                    <li
                      key={index}
                      css={s((t) => ({
                        "& + &": {
                          marginTop: t.spacing.sm,
                        },
                        "&:before": {
                          content: `url(${dataUriFromPath({
                            fill: t.color.text.dark.base,
                            path: paw,
                          })})`,
                          display: "block",
                          left: 0,
                          position: "absolute",
                          ...size("1em"),
                          top: "0.2em",
                          transform: "rotate(-30deg)",
                        },
                        "&:nth-child(even):before": {
                          transform: "rotate(30deg)",
                        },
                        paddingLeft: "2em",
                        position: "relative",
                      }))}
                    >
                      {t(`VideoDrScottTheOne:theOne.list.item${index}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            {references?.studies && references.studies.length > 0 && (
              <section
                css={s(gutter, (t) => ({
                  backgroundColor: t.color.background.feature3,
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                    textAlign: "center",
                  }))}
                >
                  {t("VideoDrScottTheOne:references.title")}
                </h2>
                <dl css={s(belt, bodyTextSmall, { maxWidth: 845 })}>
                  {references.studies.map(({ study }) => {
                    if (!study) {
                      return null;
                    }

                    const {
                      _meta,
                      authors,
                      link,
                      pageReference,
                      publication,
                      title,
                      year,
                    } = study;

                    return (
                      <Fragment key={_meta.id}>
                        <dt
                          css={s((t) => ({
                            "&:first-child": {
                              marginTop: 0,
                            },
                            fontSize: [12, null, 14],
                            fontWeight: t.font.primary.weight.medium,
                            lineHeight: "1.2em",
                            marginTop: t.spacing.sm,
                          }))}
                        >
                          <a
                            href={link?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {title && <RichTextFragment render={title} />}
                          </a>
                        </dt>
                        <dd
                          css={s((t) => ({
                            fontSize: [10, null, 12],
                            lineHeight: "1.2em",
                            marginTop: t.spacing.xxs,
                          }))}
                        >
                          {authors && authors[0].author} et al ({year}
                          ). {publication}, {pageReference}
                        </dd>
                      </Fragment>
                    );
                  })}
                </dl>
              </section>
            )}
          </>
        )}
      </main>

      <Footer transcript={!!data.videoSalesLetter.transcript} />

      <ProductSchema product={data.ecommerce} />

      <ToastRack
        _css={s({
          height: 0,
          position: "fixed",
          right: 0,
          top: [theme.height.nav.mobile, null, theme.height.nav.desktop],
          zIndex: 99999,
        })}
      />
    </ProductPageDataProvider>
  );
};

export default VideoDrScottTheOne;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const makeVideoStaticPropsGetter = () =>
  makeProductPageStaticPropsGetter(
    "the-one",
    async (result, { params }, { apolloClient }) => {
      // Typeguard: we won't hit this if the route is configured correctly
      if (!params?.handle || typeof params.handle !== "string") {
        return { notFound: true };
      }

      const VIDEO_SALES_LETTER = (await import("../../cms/video-sales-letter"))
        .VIDEO_SALES_LETTER;

      const { data } = await runServerSideQuery<VideoSalesLetterData>(
        apolloClient,
        {
          query: VIDEO_SALES_LETTER,
          variables: { handle: params.handle },
        }
      );

      if (!data?.videoSalesLetter) {
        return { notFound: true };
      }

      return {
        ...result,
        props: {
          ...result.props,
          data: {
            ...result.props.data,
            ecommerce: {
              ...result.props.data.ecommerce,
              defaultSelectionSku: {
                ...result.props.data.ecommerce.defaultSelectionSku,
                value: "FPTO01-PHx3",
              },
            },
            vidalytics: {
              id: data.videoSalesLetter.vidalyticsVideoId ?? DEFAULT_VIDEO_ID,
            },
            videoSalesLetter: data.videoSalesLetter,
          },
        },
      };
    }
  );
