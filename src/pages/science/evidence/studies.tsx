import { useLazyQuery } from "@apollo/react-hooks";
import { NextPageWithApollo, throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React, { FC, Fragment } from "react";
import { Trans } from "react-i18next";
import LazyAnimation from "src/ui/base/lazy-animation";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, gutterTop, my, px, py, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import OG_IMG from "../../../assets/images/evidence/OPENGRAPH.jpg";
import {
  EvidencePageData,
  returnReference,
  STUDIES_FOR_INGREDIENT,
  StudiesData,
  StudyCountData,
} from "../../../cms/evidence-page";
import { getIngredientTitle } from "../../../cms/ingredient";
import type { Study } from "../../../cms/study";
import Accordion from "../../../ui/base/accordion";
import { Grid, Item } from "../../../ui/base/grid";
import Spinner from "../../../ui/base/spinner";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingEcho,
} from "../../../ui/base/typography";
import { spacing } from "../../../ui/styles/variables";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  header: {
    title: "All {{ count }} Research Studies",
  },
  meta: {
    description:
      "Our experts have assembled a catalogue of over 400 research publications verifying the health claims of every one of our ingredients",
    openGraph: {
      description: "100% Of Our Ingredients Are Backed By Trusted Research",
      title: "All our ingredients have verified health claims",
    },
    title: "100% Of Our Ingredients Are Backed By Trusted Research | FOTP",
  },
  studies: {
    doubleBlind: "Double-blind",
    institute: "Institute",
    keyFindings: "Key findings",
    length: "Length",
    participants: "Participants",
    placeboControlled: "Placebo-controlled",
    randomised: "Randomized",
    study: "Study",
    type: "Type",
    view: "View all studies",
  },
};

const KeyStudy: FC<{ index: number; study: Study }> = ({ study, index }) => {
  const { t } = useLocale();

  const types = [
    { key: "placeboControlled", value: study.placeboControlled },
    { key: "doubleBlind", value: study.doubleBlind },
    { key: "randomised", value: study.randomised },
  ];
  const isEven = !(index % 2);

  const [loadStudies, { data, loading }] = useLazyQuery<StudiesData>(
    STUDIES_FOR_INGREDIENT
  );
  const viewLink = t("evidencePage:studies.view");
  const ingredientTitle = study.focus && getIngredientTitle(study.focus);

  return (
    <div
      css={s(belt, (t) => ({
        marginTop: index > 0 ? t.spacing.xxl : 0,
        paddingTop: index > 0 ? t.spacing.xxl : 0,
      }))}
      key={index}
    >
      <div
        css={s((t) => ({
          alignItems: "center",
          display: "flex",
          marginBottom: [t.spacing.xl, null, t.spacing.xxl],
        }))}
      >
        {study.focus?.image && (
          <div
            css={s((t) => ({
              flexShrink: 0,
              marginRight: [t.spacing.sm, null, t.spacing.md],
              width: [72, null, 84],
            }))}
          >
            <ResponsiveImage
              alt=""
              width={168}
              height={168}
              sizes={{ width: 168 }}
              src={study.focus.image.url}
            />
          </div>
        )}
        <h2>
          {ingredientTitle && (
            <span
              css={s(headingBravo, (t) => ({
                display: "block",
                fontSize: [22, 28, 36],
                marginBottom: t.spacing.xxs,
              }))}
            >
              {ingredientTitle}
            </span>
          )}
          <span
            css={s(bodyText, (t) => ({
              display: "block",
              fontWeight: t.font.primary.weight.medium,
              lineHeight: "1.2em",
            }))}
          >
            {study.focus?.summary && (
              <RichTextFragment render={study.focus.summary} />
            )}
          </span>
        </h2>
      </div>
      <Grid
        _css={s({ position: "relative" })}
        direction={isEven ? "ltr" : "rtl"}
        key={index}
        gx={(t) => [t.spacing.xl, null, t.spacing.xl]}
      >
        <Item
          _css={s({
            minHeight: ["none", null, null, 460],
          })}
          width={["100%", null, null, "49%"]}
        >
          <h3
            css={s(headingEcho, (t) => ({
              ...my([t.spacing.sm, null, t.spacing.lg]),
            }))}
          >
            {t("evidencePage:studies.keyFindings")}
          </h3>

          <p
            css={s(headingCharlie, (t) => ({
              ...my([t.spacing.sm, null, t.spacing.md]),
            }))}
          >
            {study.message && <RichTextFragment render={study.message} />}
          </p>

          {study.diagram && (
            <div
              css={s((t) => ({
                left: isEven ? "initial" : 0,
                paddingLeft: isEven ? [0, null, null, t.spacing.md] : 0,
                paddingRight: isEven ? 0 : [0, null, null, t.spacing.md],
                position: ["static", null, null, "absolute"],
                ...py([spacing.xl, null, null, 0]),
                right: isEven ? 0 : "initial",
                textAlign: "center",
                top: "0",
                width: ["auto", null, null, "50%"],
              }))}
            >
              <LazyAnimation>
                <ResponsiveImage
                  alt=""
                  height={study.diagram.dimensions.height}
                  sizes={{
                    maxWidth: [null, null, null, 640],
                    width: ["100vw", null, null, "50vw"],
                  }}
                  src={study.diagram.url}
                  width={study.diagram.dimensions.width}
                />
              </LazyAnimation>
            </div>
          )}
          <div
            css={s((t) => ({
              borderTop: `1px solid ${t.color.border.light}`,
              marginTop: [0, null, null, t.spacing.lg],
              paddingBottom: [t.spacing.lg, null, null, t.spacing.xl],
              paddingTop: t.spacing.sm,
            }))}
          >
            <p
              css={s(bodyTextSmall, (t) => ({
                fontWeight: t.font.primary.weight.medium,
                lineHeight: ["20px", null, "22px"],
              }))}
            >
              <a
                href={study.link?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {study.title && <RichTextFragment render={study.title} />}
              </a>
            </p>
            <p
              css={s((t) => ({
                fontSize: [12, null, 14],
                fontStyle: "italic",
                marginTop: t.spacing.xs,
              }))}
            >
              {returnReference(study)}
            </p>
          </div>

          <div
            css={s((t) => ({
              marginTop: [t.spacing.md, t.spacing.lg, t.spacing.xl],
            }))}
          >
            <dl
              css={s(bodyTextSmall, {
                "& > dd": {
                  flexBasis: ["100%", "100%", "60%"],
                },
                "& > dt": {
                  flexBasis: ["100%", "100%", "40%"],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  width: "160px",
                },
                alignItems: "flex-start",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                lineHeight: "28px",
              })}
            >
              {study.participants && (
                <>
                  <dt>{t("evidencePage:studies.participants")}</dt>
                  <dd>{study.participants}</dd>
                </>
              )}
              {study.duration && (
                <>
                  <dt>{t("evidencePage:studies.length")}</dt>
                  <dd>{study.duration}</dd>
                </>
              )}
              {study.sponsor && (
                <>
                  <dt>{t("evidencePage:studies.institute")}</dt>
                  <dd>{study.sponsor}</dd>
                </>
              )}
              {(study.doubleBlind ||
                study.placeboControlled ||
                study.randomised) && (
                <>
                  <dt>{t("evidencePage:studies.type")}</dt>
                  <dd>
                    {types.map((type, index) => {
                      const comma = type.value && (index === 0 || index === 1);
                      return (
                        <Fragment key={index}>
                          {type.value && t(`evidencePage:studies.${type.key}`)}
                          {comma && ", "}
                        </Fragment>
                      );
                    })}
                  </dd>
                </>
              )}
            </dl>
            <Accordion
              _css={s((t) => ({
                borderTopStyle: "solid",
                marginTop: [t.spacing.lg, null, t.spacing.lg],
              }))}
              id="details-use"
              label={viewLink}
              labelAs="h3"
              onClick={() => {
                if (study.focus?._meta.id) {
                  loadStudies({
                    variables: { ingredientId: study.focus._meta.id },
                  });
                }
              }}
            >
              <dl
                css={s((t) => ({
                  borderTopStyle: "solid",
                  minHeight: t.spacing.xxxl,
                  position: "relative",
                  ...py(t.spacing.sm),
                }))}
              >
                {!loading && data ? (
                  data.studies.edges.map(
                    (
                      {
                        node: {
                          authors,
                          link,
                          pageReference,
                          publication,
                          title,
                          year,
                        },
                      },
                      index
                    ) => (
                      <div
                        key={index}
                        css={s(bodyTextSmall, (t) => ({
                          "& *": {
                            fontSize: [12, null, 14],
                            fontWeight: t.font.primary.weight.medium,
                          },
                          "& dd": {
                            fontSize: [10, null, 12],
                            fontStyle: "italic",
                            paddingTop: t.spacing.xs,
                          },
                          "&:hover": {
                            backgroundColor: t.color.background.feature1,
                          },
                          backgroundColor: t.color.background.base,
                          cursor: "pointer",
                          display: "block",
                          fontWeight: t.font.secondary.weight.bold,
                          padding: t.spacing.sm,
                          transition: "all 0.15s ease",
                        }))}
                      >
                        <dt>
                          <a
                            href={link?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {title && <RichTextFragment render={title} />}
                          </a>
                        </dt>
                        <dd>
                          {authors && authors[0].author} et al ({year}
                          ). {publication}, {pageReference}
                        </dd>
                      </div>
                    )
                  )
                ) : (
                  <Spinner />
                )}
              </dl>
            </Accordion>
          </div>
        </Item>
        <Item width={["100%", null, null, "51%"]} />
      </Grid>
    </div>
  );
};

interface EvidencePageProps {
  evidence: EvidencePageData["evidencePage"];
  totalStudies: number;
}

export const EvidencePage: NextPageWithApollo<EvidencePageProps> = ({
  evidence: { keyStudies },
  // TODO: Replace hardcoded count with `totalStudies`
  totalStudies,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "evidencePage", enUsResource);

  return (
    <Standard>
      <Metadata
        description={t("evidencePage:meta.description")}
        title={t("evidencePage:meta.title")}
        openGraph={{
          description: t("evidencePage:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("evidencePage:meta.openGraph.title"),
        }}
      />
      <main>
        <section css={s(gutterTop)}>
          <h1
            css={s(headingAlpha, {
              textAlign: "center",
            })}
          >
            <Trans
              i18nKey="evidencePage:header.title"
              values={{ count: totalStudies }}
            />
          </h1>
          {/* studies */}
          <div
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.base,
              color: t.color.text.dark.base,
              ...px([t.spacing.md, null, t.spacing.xxl]),
            }))}
            id="details"
          >
            {keyStudies?.map(({ study }, index) => (
              <LazyAnimation key={index}>
                <KeyStudy index={index} study={study} />
              </LazyAnimation>
            ))}
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default EvidencePage;

export const getStaticProps = makeStaticPropsGetter(
  async (_context, { apolloClient }) => {
    const evidenceHandle = "studies";

    const { EVIDENCE_PAGE, STUDY_COUNT } = await import(
      "../../../cms/evidence-page"
    );

    const result = await Promise.all([
      apolloClient.query<EvidencePageData>({
        fetchPolicy: "no-cache",
        query: EVIDENCE_PAGE,
        variables: {
          handle: evidenceHandle,
        },
      }),
      apolloClient.query<StudyCountData>({
        fetchPolicy: "no-cache",
        query: STUDY_COUNT,
      }),
    ]);
    throwGraphQLErrors(result);

    const [evidence, studyCount] = result;

    if (!evidence?.data?.evidencePage) {
      throw new Error(
        `Unexpected missing 'evidence_page' type with handle "${evidenceHandle}""`
      );
    }

    const totalStudies = studyCount?.data?.studies?.totalCount ?? null;
    if (totalStudies === null) {
      throw new Error("Unexpected missing study count");
    }

    return {
      props: {
        evidence: evidence.data.evidencePage,
        totalStudies,
      },
      revalidate: 5 * 60,
    };
  }
);
