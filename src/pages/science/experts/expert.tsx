import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { hasContent, renderAsString, RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React from "react";

import { belt, gutter, py, s, size } from "@/common/ui/utils";

import { makeServerSidePropsGetter } from "../../../../pages/_app";
import { Expert } from "../../../cms/common";
import {
  ExpertData,
  ExpertPersonSchema,
  getInstagramUrl,
  getTwitterUrl,
} from "../../../cms/experts";
import { RichText } from "../../../cms/prismic";
import { Grid, Item } from "../../../ui/base/grid";
import Icon from "../../../ui/base/icon";
import ResponsiveImage from "../../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmallStatic,
  headingAlpha,
  headingEcho,
} from "../../../ui/base/typography";
import instagram from "../../../ui/icons/instagram";
import twitter from "../../../ui/icons/twitter";
import Standard from "../../../ui/templates/standard";

interface ExpertPageProps {
  expert: Expert;
}

export const ExpertPage: NextPageWithApollo<ExpertPageProps> = ({ expert }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "expertPage", {
    meta: {
      title: "Say hello to {{ name }} | Science Advisory Board",
    },
  });

  const metadata = {
    description: renderAsString(expert?.summary ?? []),
    title: `${t("expertPage:meta.title", {
      name: renderAsString(expert?.name ?? []),
    })} | ${t("common:fotp")}`,
  };

  return (
    <Standard>
      <Metadata {...metadata} openGraph={metadata} />
      <main>
        <header
          css={s(gutter, (t) => ({
            ...py([t.spacing.xl, null, t.spacing.xxl]),
          }))}
        >
          <div css={s(belt)}>
            <div
              css={s({
                alignItems: "center",
                display: ["block", null, "flex"],
                textAlign: ["center", null, "left"],
              })}
            >
              {expert.image && (
                <div
                  css={s({
                    borderRadius: 200,
                    margin: ["0 auto", null, 0],
                    overflow: "hidden",
                    width: [150, null, 200],
                  })}
                >
                  <ResponsiveImage
                    alt=""
                    height={expert.image.dimensions.height}
                    priority
                    sizes={{
                      width: [150, null, 200],
                    }}
                    src={expert.image.url}
                    width={expert.image.dimensions.width}
                  />
                </div>
              )}
              <div css={s((t) => ({ paddingLeft: [0, null, t.spacing.xl] }))}>
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.xs,
                    marginTop: [t.spacing.sm, null, 0],
                  }))}
                >
                  {expert.name && <RichTextFragment render={expert.name} />}
                </h1>
                <p
                  css={s(bodyText, (t) => ({
                    fontFamily: t.font.secondary.family,
                    fontSize: [18, null, 20],
                    fontStyle: "italic",
                    marginTop: t.spacing.sm,
                  }))}
                >
                  {expert?.postNominal && (
                    <>
                      <RichTextFragment render={expert?.postNominal} />
                      {", "}
                    </>
                  )}
                  {expert?.role && <RichTextFragment render={expert?.role} />}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div css={s(gutter, (t) => ({ paddingTop: [t.spacing.sm, null, 0] }))}>
          <div css={s(belt)}>
            <Grid
              direction="rtl"
              gx={(t) => [t.spacing.xl, null, t.spacing.xxl, t.spacing.xxxl]}
              gy={(t) => t.spacing.lg}
              itemWidth={["100%", null, "33.333333%"]}
            >
              <Item width={["100%", null, "66.666666%"]}>
                <div css={s(bodyText)}>
                  {hasContent(expert?.bio) && <RichText render={expert.bio} />}
                </div>
              </Item>
              <Item width={["100%", null, "33.333333%"]}>
                {expert.qualifications && (
                  <div
                    css={s((t) => ({
                      borderTopColor: t.color.border.light,
                      borderTopStyle: "solid",
                      borderTopWidth: 1,
                    }))}
                  >
                    {expert.qualifications?.map(
                      ({ course, institution, institutionImage }, index) => (
                        <div
                          key={index}
                          css={s((t) => ({
                            display: "flex",
                            paddingTop: t.spacing.lg,
                          }))}
                        >
                          {institutionImage && (
                            <div
                              css={s({
                                ...size(48),
                                flexShrink: 0,
                              })}
                            >
                              <ResponsiveImage
                                alt=""
                                height={96}
                                src={institutionImage.url}
                                width={96}
                                sizes={{ width: 48 }}
                              />
                            </div>
                          )}
                          <div
                            css={s((t) => ({
                              paddingLeft: institutionImage ? t.spacing.md : 0,
                            }))}
                          >
                            <h3
                              css={s(headingEcho, (t) => ({
                                marginBottom: t.spacing.xs,
                              }))}
                            >
                              {institution}
                            </h3>
                            <h3 css={s(bodyTextSmallStatic)}>{course}</h3>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                {(expert.socialInstagram || expert.socialTwitter) && (
                  <ul
                    css={s((t) => ({
                      borderBottomColor: t.color.border.light,
                      borderBottomStyle: "solid",
                      borderBottomWidth: 1,
                      borderTopColor: t.color.border.light,
                      borderTopStyle: "solid",
                      borderTopWidth: 1,
                      marginTop: t.spacing.lg,
                      ...py(t.spacing.lg),
                    }))}
                  >
                    {expert.socialInstagram && (
                      <li
                        css={s(headingEcho, (t) => ({
                          marginBottom: t.spacing.sm,
                        }))}
                      >
                        <a
                          href={getInstagramUrl(expert.socialInstagram)}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Icon
                            _css={s((t) => ({
                              marginRight: t.spacing.sm,
                              ...size([18, null, 20]),
                            }))}
                            path={instagram}
                          />{" "}
                          @{expert.socialInstagram}
                        </a>
                      </li>
                    )}
                    {expert.socialTwitter && (
                      <li css={s(headingEcho)}>
                        <a
                          href={getTwitterUrl(expert.socialTwitter)}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Icon
                            _css={s((t) => ({
                              marginRight: t.spacing.sm,
                              ...size([18, null, 20]),
                            }))}
                            path={twitter}
                          />{" "}
                          @{expert.socialTwitter}
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </Item>
            </Grid>
          </div>
        </div>
      </main>
      <ExpertPersonSchema expert={expert} />
    </Standard>
  );
};

export default ExpertPage;

export const getServerSideProps = makeServerSidePropsGetter(
  async ({ params }, { apolloClient }) => {
    if (!params?.handle) {
      throw new Error('Missing param "handle"');
    }

    const { EXPERT_PAGE } = await import("../../../cms/experts");
    const { data } = await runServerSideQuery<ExpertData>(apolloClient, {
      query: EXPERT_PAGE,
      variables: { handle: params.handle },
    });

    if (!data?.expert || !hasContent(data.expert.name)) {
      return { notFound: true };
    }

    return {
      props: { expert: data.expert },
    };
  }
);
