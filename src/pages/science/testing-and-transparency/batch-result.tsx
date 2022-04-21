import { NextPageWithApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React from "react";

import { belt, gutter, px, py, s } from "@/common/ui/utils";

import { makeServerSidePropsGetter } from "../../../../pages/_app";
import type { BatchResultData } from "../../../cms/batch-result";
import { textButton } from "../../../ui/base/button";
import {
  bodyText,
  callToActionText,
  headingAlpha,
  headingCharlie,
  headingEcho,
} from "../../../ui/base/typography";
import Standard from "../../../ui/templates/standard";

const enUsResource = {
  header: {
    title: "Batch",
  },
  meta: {
    title: "Batch test results",
  },
  report: {
    defaultLabel: "View report",
  },
};

interface BatchResultPageProps {
  data: BatchResultData;
}

export const BatchResultPage: NextPageWithApollo<BatchResultPageProps> = ({
  data,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "batchResultsPage", enUsResource);

  const { body, status, title } = data.result;

  const metadata = {
    title: `${t("batchResultsPage:meta.title")} | ${t("common:fotp")}`,
  };

  return (
    <Standard>
      <Metadata {...metadata} openGraph={metadata} />
      <main id="main">
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.base,
            color: t.color.text.dark.base,
          }))}
        >
          <div css={s(belt, { maxWidth: 840 })}>
            <div
              css={s((t) => ({
                borderBottom: `2px solid ${t.color.border.dark}`,
                marginBottom: t.spacing.xl,
                paddingBottom: [t.spacing.xl, null, t.spacing.xxl],
                position: "relative",
              }))}
            >
              <h1
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.md,
                }))}
              >
                {t("batchResultsPage:header.title")}: {title}
              </h1>
              <div
                css={s((t) => ({
                  backgroundColor:
                    status === "pass"
                      ? t.color.state.success
                      : t.color.state.warning,
                  borderRadius: t.spacing.xl,
                  color: t.color.text.light.base,
                  display: "inline-block",
                  position: ["static", null, "absolute"],
                  right: 0,
                  top: 0,
                  ...py(t.spacing.xs),
                  ...px(t.spacing.md),
                }))}
              >
                <span css={s(callToActionText)}>Overall {status}</span>
              </div>
            </div>
            {body?.map(
              ({ fields, primary }, index) =>
                primary && (
                  <div
                    key={index}
                    css={s((t) => ({
                      borderBottom: `1px solid ${t.color.border.light}`,
                      marginBottom: t.spacing.xl,
                      paddingBottom: t.spacing.xl,
                      paddingRight: [
                        0,
                        t.spacing.xl,
                        t.spacing.xxl,
                        t.spacing.xxxl,
                      ],
                      position: "relative",
                    }))}
                  >
                    {primary.status && (
                      <div
                        css={s((t) => ({
                          backgroundColor:
                            primary.status === "pass"
                              ? t.color.state.success
                              : t.color.state.warning,
                          borderRadius: t.spacing.xl,
                          color: t.color.text.light.base,
                          position: "absolute",
                          right: 0,
                          top: [-12, null, 0],
                          ...py(t.spacing.xxs),
                          ...px(t.spacing.md),
                        }))}
                      >
                        <span css={s(callToActionText)}>{primary.status}</span>
                      </div>
                    )}
                    <h2>
                      <span
                        css={s(headingEcho, (t) => ({
                          display: "block",
                          fontSize: 12,
                          letterSpacing: "0.15em",
                          marginBottom: t.spacing.md,
                          textTransform: "uppercase",
                        }))}
                      >
                        Test {index + 1}
                      </span>
                      {primary?.labTest?.title && (
                        <span
                          css={s(headingCharlie, (t) => ({
                            display: "block",
                            marginBottom: t.spacing.sm,
                          }))}
                        >
                          <RichTextFragment render={primary.labTest.title} />
                        </span>
                      )}
                    </h2>
                    {primary?.labTest?.description && (
                      <p
                        css={s(bodyText, (t) => ({
                          marginBottom: t.spacing.sm,
                        }))}
                      >
                        <RichTextFragment
                          render={primary.labTest.description}
                        />
                      </p>
                    )}
                    {fields?.map(
                      ({ report, reportLabel }, index) =>
                        report?.url && (
                          <a
                            key={index}
                            css={s(textButton(), (t) => ({
                              fontSize: 12,
                              marginRight: fields.length > 1 ? t.spacing.lg : 0,
                              marginTop: t.spacing.sm,
                            }))}
                            href={report.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {reportLabel ??
                              t("batchResultsPage:report.defaultLabel")}
                          </a>
                        )
                    )}
                  </div>
                )
            )}
          </div>
        </section>
      </main>
    </Standard>
  );
};

export default BatchResultPage;

export const getServerSideProps = makeServerSidePropsGetter(
  async ({ params }, { apolloClient }) => {
    if (!params?.handle) {
      throw new Error('Missing param "handle"');
    }

    const BATCH_RESULT = (await import("../../../cms/batch-result"))
      .BATCH_RESULT;

    const { data } = await runServerSideQuery(apolloClient, {
      query: BATCH_RESULT,
      variables: { handle: params.handle },
    });

    if (!data?.result) {
      return { notFound: true };
    }

    return {
      props: { data },
    };
  }
);
