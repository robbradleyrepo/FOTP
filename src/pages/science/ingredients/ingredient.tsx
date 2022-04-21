import {
  initializeApollo,
  NextPageWithApollo,
  throwGraphQLErrors,
} from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import {
  hasContent,
  renderAsString,
  RichText,
  RichTextFragment,
} from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths, GetStaticPathsResult } from "next";
import React from "react";
import { Grid, Item } from "src/ui/base/grid";
import LazyAnimation from "src/ui/base/lazy-animation";

import { belt, gutter, gutterX, mx, my, py, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../../pages/_app";
import OG_IMG from "../../../assets/images/ingredients/OPENGRAPH.jpg";
import type {
  StudiesForIngredient,
  StudiesForIngredientData,
} from "../../../cms/evidence-page";
import type { Ingredient, IngredientData } from "../../../cms/ingredient";
import type { IngredientsPageData } from "../../../cms/ingredients-page";
import { getMapUrl } from "../../../maps/helpers";
import ResponsiveImage from "../../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingDelta,
  headingEcho,
  textLink,
} from "../../../ui/base/typography";
import { mapCmsIngredientToCoreIngredientProperties } from "../../../ui/modules/ingredients/data-mapping";
import IngredientsGrid from "../../../ui/modules/ingredients/grid";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  allStudiesCTA: "View all related studies",
  benefitTitle: "Why we chose it",
  descriptionTitle: "What is it?",
  effectTitle: "What does it do?",
  meta: {
    openGraph: {
      title: "{{ name }} | Front Of The Pack",
    },
    title: "{{ name }} | Front Of The Pack Top Dog Supplements",
  },
  otherTitle: "Other ingredients",
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

interface IngredientPageProps {
  ingredient: Ingredient;
  ingredients: Ingredient[];
  studies: StudiesForIngredient[];
}

export const IngredientPage: NextPageWithApollo<IngredientPageProps> = ({
  ingredient,
  ingredients,
  studies,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ingredientPage", enUsResource);

  const coreIngredients = ingredients.map(
    mapCmsIngredientToCoreIngredientProperties
  );

  const {
    advantageDescription,
    advantageTitle,
    benefits,
    description,
    effects,
    heroStudy,
    image,
    productName: brandName,
    sourceLatLng,
    specifications,
    summary,
    type: name,
  } = ingredient;

  return (
    <Standard>
      <Metadata
        description={summary && renderAsString(summary)}
        title={t("ingredientPage:meta.title", {
          name: name && renderAsString(name),
        })}
        openGraph={{
          description: summary && renderAsString(summary),
          image: OG_IMG.src,
          title: t("ingredientPage:meta.openGraph.title", {
            name: name && renderAsString(name),
          }),
        }}
      />
      <main>
        <article>
          {/* header */}
          <header
            css={s((t) => ({
              backgroundColor: t.color.background.feature3,
              ...py([t.spacing.lg, t.spacing.lg, t.spacing.xxl]),
            }))}
          >
            <div css={s(belt, gutterX)}>
              <Grid
                innerCss={s({
                  alignItems: "center",
                  justifyContent: "flex-start",
                })}
              >
                <Item
                  width={["100%", null, "60%", "70%"]}
                  _css={s({
                    alignItems: "center",
                    display: [null, null, "flex"],
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    textAlign: ["center", null, "left"],
                  })}
                >
                  {image && (
                    <div
                      css={s((t) => ({
                        margin: ["auto", null, 0],
                        marginBottom: [t.spacing.md, null, 0],
                        ...size(200),
                      }))}
                    >
                      <ResponsiveImage
                        _css={s((t) => ({
                          borderRadius: t.radius.xxl,
                        }))}
                        alt=""
                        height={image.dimensions.height}
                        src={image.url}
                        width={image.dimensions.width}
                        sizes={{ width: 200 }}
                      />
                    </div>
                  )}
                  <div
                    css={s((t) => ({
                      marginLeft: [0, null, t.spacing.md],
                    }))}
                  >
                    <h1 css={s(headingAlpha)}>
                      {hasContent(name) && <RichTextFragment render={name} />}
                    </h1>
                    {hasContent(summary) && (
                      <p
                        css={s(bodyTextSmall, (t) => ({
                          lineHeight: 1.5,
                          marginTop: t.spacing.xxs,
                        }))}
                      >
                        <RichTextFragment render={summary} />
                      </p>
                    )}
                  </div>
                </Item>
                <Item
                  _css={s({
                    alignItems: "center",
                    justifyContent: "flex-end",
                  })}
                  width={["100%", null, "40%", "30%"]}
                >
                  <dl
                    css={s(bodyTextSmall, (t) => ({
                      borderLeft: `solid 1px ${t.color.state.alt}`,
                      borderWidth: [0, null, 1],
                      dd: {
                        gridColumnStart: 2,
                        textAlign: "right",
                      },
                      display: "grid",
                      dt: {
                        fontWeight: "bold",
                        gridColumnStart: 1,
                      },
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "auto",
                      marginTop: t.spacing.sm,
                      ...mx("auto"),
                      rowGap: t.spacing.md,
                      ...py(t.spacing.md),
                      paddingLeft: [null, 0, t.spacing.lg, t.spacing.xl],
                      width: ["100%", "50%", "max-content", "100%"],
                    }))}
                  >
                    {hasContent(brandName) && (
                      <>
                        <dt>Brand:</dt>
                        <dd>
                          <RichTextFragment render={brandName} />
                        </dd>
                      </>
                    )}
                    {specifications
                      ?.filter(({ name, value }) => !!name && !!value)
                      .map(({ name, value }, idx) => (
                        <React.Fragment key={idx}>
                          <dt>{name}:</dt>
                          <dd>{value}</dd>
                        </React.Fragment>
                      ))}
                  </dl>
                </Item>
              </Grid>
            </div>
          </header>

          {/* main article content */}
          <section css={s(belt, gutter, { maxWidth: 820 })}>
            {description && (
              <>
                <h2
                  css={s(headingDelta, (t) => ({
                    marginBottom: t.spacing.sm,
                  }))}
                >
                  {t("ingredientPage:descriptionTitle")}
                </h2>
                <div
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  <RichText render={description} />
                </div>
              </>
            )}
            {effects && (
              <>
                <h4
                  css={s(headingDelta, (t) => ({
                    marginBottom: t.spacing.sm,
                  }))}
                >
                  {t("ingredientPage:effectTitle")}
                </h4>
                <div
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  <RichText render={effects} />
                </div>
              </>
            )}
            {benefits && (
              <>
                <h4
                  css={s(headingDelta, (t) => ({
                    marginBottom: t.spacing.sm,
                  }))}
                >
                  {t("ingredientPage:benefitTitle")}
                </h4>
                <div
                  css={s(bodyText, (t) => ({
                    marginBottom: t.spacing.lg,
                  }))}
                >
                  <RichText render={benefits} />
                </div>
              </>
            )}
            {advantageTitle && (
              <h4
                css={s(headingDelta, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                <RichTextFragment render={advantageTitle} />
              </h4>
            )}
            {advantageDescription && (
              <div
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.lg,
                }))}
              >
                <RichText render={advantageDescription} />
              </div>
            )}
            {sourceLatLng && (
              <LazyAnimation>
                <div
                  css={s({
                    backgroundImage: `url('${getMapUrl({
                      height: 1120,
                      latitude: 40,
                      longitude: 12,
                      markers: [sourceLatLng],
                      width: 1280,
                      zoom: 1.3,
                    })}')`,
                    backgroundPosition: ["20% top", "25% top", "33% top"],
                    backgroundSize: ["auto 395px", null, null, "auto 105%"],
                    height: 375,
                    width: "100%",
                  })}
                />
              </LazyAnimation>
            )}
          </section>

          {/* Evidence  */}
          {heroStudy && (
            <section css={s(belt, gutter, { maxWidth: 820, paddingTop: 0 })}>
              <h4 css={headingDelta}>Evidence</h4>
              <p
                css={s(headingEcho, (t) => ({
                  marginTop: t.spacing.md,
                }))}
              >
                Key Findings
              </p>
              <p
                css={s(headingDelta, (t) => ({
                  marginTop: t.spacing.md,
                }))}
              >
                {hasContent(heroStudy.message) && (
                  <RichTextFragment render={heroStudy.message} />
                )}
              </p>

              <dl
                css={s(bodyTextSmall, textLink, (t) => ({
                  "& *": {
                    fontSize: [12, null, 14],
                  },
                  "& dd": {
                    fontSize: [10, null, 12],
                    fontStyle: "italic",
                    ...py(t.spacing.xxs),
                  },
                  cursor: "pointer",
                  display: "block",
                  marginTop: t.spacing.sm,
                  transition: "all 0.15s ease",
                }))}
              >
                <dt>
                  <a
                    href={heroStudy.link?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {hasContent(heroStudy.title) && (
                      <RichTextFragment render={heroStudy.title} />
                    )}
                  </a>
                </dt>
                <dd>
                  {/* RichTextFragment throwing error for other types? */}
                  {heroStudy?.authors && heroStudy.authors[0].author}
                  et al ({heroStudy?.year}). {heroStudy?.publication},{" "}
                  {heroStudy?.pageReference}
                </dd>
              </dl>
              {/* Chart (Data) */}
              {heroStudy.diagram && (
                <>
                  <div
                    css={s((t) => ({
                      ...py([t.spacing.md, t.spacing.md, t.spacing.xxl]),
                      ...my(t.spacing.xl),

                      borderBottom: `solid 1px ${t.color.state.alt}`,
                    }))}
                  >
                    <LazyAnimation>
                      <ResponsiveImage
                        alt=""
                        height={heroStudy.diagram.dimensions.height}
                        sizes={{
                          maxWidth: [null, null, null, 640],
                          width: ["100vw", null, null, "50vw"],
                        }}
                        src={heroStudy.diagram.url}
                        width={heroStudy.diagram.dimensions.width}
                      />
                    </LazyAnimation>

                    <dl
                      css={s(bodyTextSmall, (t) => ({
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
                        paddingTop: t.spacing.xxl,
                      }))}
                    >
                      {heroStudy.participants && (
                        <>
                          <dt>{t("ingredientPage:studies.participants")}</dt>
                          <dd>{heroStudy.participants}</dd>
                        </>
                      )}
                      {heroStudy.duration && (
                        <>
                          <dt>{t("ingredientPage:studies.length")}</dt>
                          <dd>{heroStudy.duration}</dd>
                        </>
                      )}
                      {heroStudy.sponsor && (
                        <>
                          <dt>{t("ingredientPage:studies.institute")}</dt>
                          <dd>{heroStudy.sponsor}</dd>
                        </>
                      )}
                      {(heroStudy.doubleBlind ||
                        heroStudy.placeboControlled ||
                        heroStudy.randomised) && (
                        <>
                          <dt>{t("ingredientPage:studies.type")}</dt>
                          <dd>
                            {[
                              {
                                key: "placeboControlled",
                                value: heroStudy.placeboControlled,
                              },
                              {
                                key: "doubleBlind",
                                value: heroStudy.doubleBlind,
                              },
                              {
                                key: "randomised",
                                value: heroStudy.randomised,
                              },
                            ].map((type, index) => {
                              const comma =
                                type.value && (index === 0 || index === 1);
                              return (
                                <React.Fragment key={index}>
                                  {type.value &&
                                    t(`ingredientPage:studies.${type.key}`)}
                                  {comma && ", "}
                                </React.Fragment>
                              );
                            })}
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                </>
              )}

              {/* Further Research */}
              {studies.length > 0 && (
                <>
                  <h3
                    css={s(headingEcho, (t) => ({
                      marginTop: t.spacing.md,
                    }))}
                  >
                    Further Research
                  </h3>

                  <dl
                    css={s((t) => ({
                      borderBottom: `solid 1px ${t.color.state.alt}`,
                      position: "relative",
                      ...py(t.spacing.sm),
                    }))}
                  >
                    {studies.map(
                      (
                        {
                          authors,
                          link,
                          pageReference,
                          publication,
                          title,
                          year,
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
                              backgroundColor: t.color.background.feature3,
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
                    )}
                  </dl>
                </>
              )}
            </section>
          )}
        </article>

        {/* ingredients grid */}
        <aside
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.feature3,
            textAlign: "center",
          }))}
          id="details"
        >
          <div
            css={s(belt, (t) => ({
              maxWidth: 680,
              paddingBottom: [t.spacing.lg, t.spacing.lg, t.spacing.xxl],
            }))}
          >
            <h4 css={s(headingAlpha)}>{t("ingredientPage:otherTitle")}</h4>
          </div>

          <div css={s(belt)}>
            <LazyAnimation>
              <IngredientsGrid
                initialShowCount={coreIngredients.length}
                ingredients={coreIngredients}
              />
            </LazyAnimation>
          </div>
        </aside>
      </main>
    </Standard>
  );
};

export default IngredientPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const client = initializeApollo({});

  const { INGREDIENTS_PAGE } = await import("../../../cms/ingredients-page");

  const { data } = await client.query<IngredientsPageData>({
    fetchPolicy: "no-cache",
    query: INGREDIENTS_PAGE,
  });

  const paths: GetStaticPathsResult["paths"] = [];

  // Build just the one page at build time to catch any build time errors
  const ingredient = (data.ingredientsPage?.ingredients ?? []).shift();
  if (ingredient) {
    paths.push({
      params: {
        handle: ingredient.ingredient._meta.uid,
      },
    });
  }

  return {
    fallback: "blocking",
    paths,
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    if (typeof params?.handle !== "string") {
      throw new Error('Invalid or missing param "handle"');
    }

    const [
      { INGREDIENT },
      { INGREDIENTS_PAGE },
      { STUDIES_FOR_INGREDIENT },
    ] = await Promise.all([
      import("../../../cms/ingredient"),
      import("../../../cms/ingredients-page"),
      import("../../../cms/evidence-page"),
    ]);

    const result = await Promise.all([
      apolloClient.query<IngredientData>({
        query: INGREDIENT,
        variables: {
          handle: params.handle,
        },
      }),
      apolloClient.query<IngredientsPageData>({
        query: INGREDIENTS_PAGE,
      }),
    ]);
    throwGraphQLErrors(result);

    const [item, rest] = result;

    if (!item.data.ingredient) {
      return {
        notFound: true,
      };
    }

    if (!rest.data?.ingredientsPage?.ingredients) {
      throw new Error("Failed to fetch ingredient page singleton type");
    }

    const studiesResult = await apolloClient.query<StudiesForIngredientData>({
      query: STUDIES_FOR_INGREDIENT,
      variables: {
        ingredientId: item.data.ingredient._meta.id,
      },
    });
    throwGraphQLErrors(studiesResult);

    const ingredient = item.data.ingredient;
    const ingredients = rest.data.ingredientsPage.ingredients
      .map(({ ingredient }) => ingredient)
      .filter((item) => item._meta.uid !== ingredient._meta.uid);
    const studies =
      studiesResult.data?.studies?.edges?.map(({ node }) => node) ?? [];

    return {
      props: {
        ingredient,
        ingredients,
        studies,
      },
      revalidate: 5 * 60,
    };
  }
);
