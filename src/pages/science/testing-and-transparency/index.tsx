import { useApolloClient } from "@apollo/react-hooks";
import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { validateRequired } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { renderAsString, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { AnyObject } from "react-final-form";
import { Trans } from "react-i18next";
import { useInView } from "react-intersection-observer";
import Hero from "src/ui/base/hero";
import LazyAnimation from "src/ui/base/lazy-animation";
import ResponsiveImage from "src/ui/base/responsive-image";
import { theme } from "src/ui/styles/theme";

import {
  belt,
  greedy,
  gutter,
  gutterBottom,
  gutterX,
  mx,
  px,
  py,
  s,
} from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import HEADER_TRANS_IMG from "../../../assets/images/science/HEADER_TRANS.png";
import HEADER_TRANS_MOBILE_IMG from "../../../assets/images/science/HEADER_TRANS_MOBILE.png";
import OG_IMG from "../../../assets/images/testing/OPENGRAPH.jpg";
import { BATCH_RESULT, BatchResultData } from "../../../cms/batch-result";
import { TestingPageData } from "../../../cms/testing-page";
import { primaryButton, textButton } from "../../../ui/base/button";
import { Grid, Item } from "../../../ui/base/grid";
import {
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingEcho,
} from "../../../ui/base/typography";
import Field from "../../../ui/forms/field";
import Form from "../../../ui/forms/form";
import { StyleProps } from "../../../ui/styles/helpers";
import { spacing } from "../../../ui/styles/variables";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  form: {
    error: "Please enter your batch code",
    label: "Batch code",
    notFound: "Sorry, that batch code could not be found",
    submit: "View results",
    text:
      "Enter your batch code and see how your dog’s supplement ranks in quality, composition, strength and safety.",
    title: "Don’t take our word for it, see the results for yourself.",
  },
  header: {
    text:
      "We put each of our supplements through a vigorous process of analyzing each ingredient for quality, composition, purity and safety.",
    title: "Testing & Transparency",
  },
  labs: {
    cta: "Read more",
    text:
      "We’ve chosen to partner with four of the world's best ISO/IEC-accredited 3rd party laboratories. Just like our manufacturing facility, they’re all based right here. In the USA.",
    title: "Introducing our labs",
  },
  meta: {
    description:
      "We test our raw supplement ingredients and finished blends a total of eight times to make sure they're safe for your dog. Test your product's batch code and see.",
    openGraph: {
      description: "We test our raw ingredients and finished blends 8 times",
      title: "Safe Supplements For Your Dog. Rigorous Product Testing",
    },
    title: "Safe Supplements For Your Dog | Rigorous Product Testing | FOTP",
  },
  tests: {
    text:
      "By putting all of our supplement ingredients under the microscope not once, not twice, but eight separate times, we’re hoping to raise the standards of quality control on the pet supplement industry. Once and for all.",
    title: "Our <i>8-step</i> supplement testing framework",
  },
  why: {
    citation: "2017 ConsumerLab report",
    stats: {
      active: {
        bold: "1 in 2",
        text:
          "joint products contain up to 50% less active ingredients than claimed",
      },
      chondroitin: {
        bold: "84%",
        text: "joint supplements contain less Chondroitin than they claim",
      },
      omega: {
        bold: "50%",
        text: "of omega fatty acid pet supplements fail label accuracy testing",
      },
    },
    subtitle: "The latest stats",
    text1:
      "Unlike pharmaceutical products, supplements are subject to limited regulation — especially when it comes to pet supplements.",
    text2:
      "This means pet care companies have little obligation to prove that their ingredients are pure and that their supplements are as potent as they claim.",
    title: "Why we take testing so seriously",
  },
};

const toBatchHandle = (handle: string) =>
  handle.replace(/^#|-/g, "").toLowerCase();

const BatchCodeForm: FC<StyleProps> = () => {
  const { t } = useLocale();
  const router = useRouter();
  const apolloClient = useApolloClient();

  const onSubmit = async ({ batch }: AnyObject) => {
    const handle = toBatchHandle(batch);
    const queryOptions = {
      query: BATCH_RESULT,
      variables: { handle },
    };

    const { data } = await apolloClient.query<BatchResultData>(queryOptions);

    if (data?.result) {
      router.push({
        pathname: "/science/testing-and-transparency/[handle]",
        query: { handle },
      });
    } else {
      return { batch: [t("testingPage:form.notFound")] };
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ busy }) => (
        <fieldset
          css={s({
            alignItems: ["center", null, null, "flex-start"],
            display: ["block", null, null, "flex"],
            maxWidth: 500,
          })}
        >
          <Field
            _css={s({
              flexGrow: 1,
              width: "100%",
            })}
            ariaLabel={t("testingPage:form.label")}
            name="batch"
            type="text"
            placeholder={t("testingPage:form.label")}
            validate={validateRequired(t("testingPage:form.error"))}
          />
          <button
            css={s(primaryButton({ disabled: busy }), (t) => ({
              height: 54,
              marginLeft: [null, null, null, t.spacing.xs],
              marginTop: [t.spacing.xs, t.spacing.md, t.spacing.md, 0],
              ...px(t.spacing.lg),
              ...py(t.spacing.xs),
              whiteSpace: "nowrap",
            }))}
            disabled={busy}
            type="submit"
          >
            {t("testingPage:form.submit")}
          </button>
        </fieldset>
      )}
    </Form>
  );
};

interface TestingPageProps {
  data: TestingPageData;
}

const borderStyle = s((t) => ({
  backgroundColor: t.color.background.dark,
  height: "calc(100% - 24px)",
  left: "11px",
  position: "absolute",
  top: 24,
  transformOrigin: "top",
  width: "2px",
}));

const borderStyleAnimate = {
  collapsed: {
    transform: "scaleY(0%)",
    transition: {
      duration: 0,
      ease: [0.83, 0, 0.17, 1],
    },
  },
  expanded: {
    transform: "scaleY(100%)",
    transition: {
      delay: 1,
      duration: 1,
    },
  },
};

const circleStyle = s((t) => ({
  backgroundColor: t.color.background.feature1,
  borderColor: t.color.background.dark,
  borderRadius: t.spacing.lg,
  borderStyle: "solid",
  borderWidth: "2px",
  height: t.spacing.md,
  left: "0px",
  position: "absolute",
  top: "0px",
  width: t.spacing.md,
}));

const circleStyleAnimate = {
  collapsed: {
    opacity: 0.2,
    transition: {
      duration: 0,
      ease: [0.83, 0, 0.17, 1],
    },
  },
  expanded: {
    opacity: 1,
    transition: {
      delay: 0.8,
      duration: 1,
    },
  },
};

function StepsAnimate() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("expanded");
    }
  }, [controls, inView]);

  return (
    <>
      <motion.div
        css={s(borderStyle)}
        ref={ref}
        animate={controls}
        initial="collapsed"
        variants={borderStyleAnimate}
      />
      <motion.span
        css={s(circleStyle)}
        ref={ref}
        animate={controls}
        initial="collapsed"
        variants={circleStyleAnimate}
      />
    </>
  );
}

export const TestingPage: NextPageWithApollo<TestingPageProps> = ({ data }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "testingPage", enUsResource);

  const { labs, tests } = data.testingPage;

  return (
    <Standard>
      <Metadata
        description={t("testingPage:meta.description")}
        title={t("testingPage:meta.title")}
        openGraph={{
          description: t("testingPage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("testingPage:meta.openGraph.title"),
        }}
      />
      <main>
        {/* header */}
        <header
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature6,
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
              <p
                css={s((t) => ({
                  fontFamily: t.font.secondary.family,
                  fontSize: [16],
                  fontStyle: "italic",
                  letterSpacing: "0.25em",
                  marginBottom: [t.spacing.sm, null, t.spacing.md],
                  textTransform: "uppercase",
                }))}
              >
                {t("testingPage:header.title")}
              </p>
              <h1 css={s(headingBravo)}>
                <Trans i18nKey="testingPage:header.text" />
              </h1>
            </div>
          </div>
        </header>

        {/* 8 Step Framework */}
        <LazyAnimation>
          <section
            css={s(gutterX, gutterBottom, (t) => ({
              backgroundColor: t.color.background.base,
              color: t.color.text.dark.base,
            }))}
          >
            <div css={s(belt, { maxWidth: 840 })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.md,
                  textAlign: ["left", null, "center"],
                  textTransform: "capitalize",
                }))}
              >
                <Trans i18nKey="testingPage:tests.title" />
              </h2>
              <p
                css={s(bodyTextStatic, (t) => ({
                  fontSize: [16, null, 18, 20],
                  marginBottom: [
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  ...mx("auto"),
                  lineHeight: ["24px", null, "28px", "30px"],
                  textAlign: ["left", null, "center"],
                }))}
              >
                {t("testingPage:tests.text")}
              </p>
            </div>
            <div css={s(belt, { maxWidth: 840, position: "relative" })}>
              {/* MAP  */}
              {tests?.map(({ test }, index) => (
                <div
                  key={index}
                  css={s((t) => ({
                    "&:last-child > div": {
                      display: "none",
                    },
                    "&:last-child > span": {
                      backgroundColor: t.color.background.dark,
                    },
                    paddingBottom: t.spacing.xl,
                    paddingLeft: [t.spacing.xl, null, t.spacing.xxl, "90"],
                    paddingTop: "2px",
                    position: "relative",
                  }))}
                >
                  <StepsAnimate />

                  <h3>
                    <span
                      css={s(headingEcho, (t) => ({
                        display: ["none", null, "block"],
                        fontSize: [12, null, null],
                        letterSpacing: "0.15em",
                        marginBottom: t.spacing.sm,
                        textTransform: "uppercase",
                      }))}
                    >
                      Test {index + 1}
                    </span>
                    <span
                      css={s(headingCharlie, (t) => ({
                        display: "block",
                        marginBottom: t.spacing.sm,
                        position: "relative",
                        top: ["-4px", null, 0],
                      }))}
                    >
                      {test.title && <RichTextFragment render={test.title} />}
                    </span>
                  </h3>

                  {test.description && (
                    <p
                      css={s(bodyTextStatic, {
                        fontSize: [16, null, 18],
                        lineHeight: ["24px", null, "26px"],
                      })}
                    >
                      <RichTextFragment render={test.description} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </LazyAnimation>

        {/* batch form */}
        <section
          css={s((t) => ({
            backgroundColor: t.color.background.feature5,
            marginBottom: t.spacing.xxl,
          }))}
        >
          <Grid
            _css={s(belt, gutter)}
            gx={theme.spacing.xl}
            gy={theme.spacing.xl}
            itemWidth={["100%", null, null, "50%"]}
          >
            <Item>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                  maxWidth: "500px",
                }))}
              >
                {t("testingPage:form.title")}
              </h2>
            </Item>
            <Item>
              <p
                css={s(bodyTextStatic, (t) => ({
                  fontFamily: t.font.secondary.family,
                  fontSize: [18, null, 20],
                  fontWeight: t.font.secondary.weight.bold,
                  marginBottom: t.spacing.md,
                }))}
              >
                <i>{t("testingPage:form.text")}</i>
              </p>
              <BatchCodeForm />
            </Item>
          </Grid>
        </section>

        {/* Labs */}
        <section
          css={s(gutter, (t) => ({
            color: t.color.text.dark.base,
          }))}
        >
          <div css={s(belt)}>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              <Trans i18nKey="testingPage:labs.title" />
            </h2>
            <p
              css={s(bodyTextStatic, (t) => ({
                marginBottom: [t.spacing.xxl, null, t.spacing.xxl],
                maxWidth: "690px",
              }))}
            >
              {t("testingPage:labs.text")}
            </p>
            <Grid
              gx={[0, null, spacing.xl, spacing.xxl, spacing.xxxl]}
              gy={[spacing.xxl, null, spacing.xxxl]}
              itemWidth={["100%", null, "50%"]}
            >
              {labs?.map(({ lab }, index) => (
                <Item key={index}>
                  {lab.logo && (
                    <h3
                      css={s((t) => ({
                        borderTop: `solid 2px ${t.color.border.dark}`,
                        borderWidth: ["2px", null, 0],
                        marginBottom: [t.spacing.md, null, t.spacing.lg],
                        paddingTop: [t.spacing.md, null, null],
                      }))}
                    >
                      <div css={s({ width: 240 })}>
                        <ResponsiveImage
                          {...lab.logo.dimensions}
                          alt={lab.name ? renderAsString(lab.name) : ""}
                          sizes={{ width: 240 }}
                          src={lab.logo.url}
                        />
                      </div>
                    </h3>
                  )}
                  {lab.description && (
                    <p
                      css={s(bodyTextStatic, (t) => ({
                        marginBottom: [t.spacing.lg, null, t.spacing.xl],
                      }))}
                    >
                      <RichTextFragment render={lab.description} />
                    </p>
                  )}
                  {lab.website && (
                    <a
                      css={s(textButton())}
                      href={lab.website.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("testingPage:labs.cta")}
                    </a>
                  )}
                </Item>
              ))}
            </Grid>
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default TestingPage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const TESTING_PAGE = (await import("../../../cms/testing-page"))
      .TESTING_PAGE;
    const { data } = await runServerSideQuery(apolloClient, TESTING_PAGE);

    if (!data?.testingPage) {
      throw new Error("Unexpected missing 'testing_page' singleton type");
    }

    return {
      props: { data },
      revalidate: 5 * 60,
    };
  }
);
