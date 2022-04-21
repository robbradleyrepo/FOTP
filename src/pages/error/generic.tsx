import { useQuery } from "@apollo/react-hooks";
import { COLLECTION_NAVIGATION } from "@sss/ecommerce/collection";
import { useLocale } from "@sss/i18n";
import React from "react";
import { Trans } from "react-i18next";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, percentage, py, s } from "@/common/ui/utils";

import ERROR_IMG from "../../assets/images/error/walkies.jpg";
import { Grid, Item } from "../../ui/base/grid";
import { PageSpinner } from "../../ui/base/spinner";
import { bodyText, headingAlpha } from "../../ui/base/typography";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  home: "Return to our <Link>home page</Link>",
  info:
    "Don’t worry, we’re working on a fix. If this keeps happening then please email us at <Email>{{ email }}</Email>",
  title: "Oh no! Looks like something went wrong",
};

const Generic = () => {
  const { i18n, t } = useLocale();

  // Fetch navigation data so we can render navigation menus within `Standard`
  const { error, loading } = useQuery(COLLECTION_NAVIGATION);

  i18n.addResourceBundle("en-US", "generic", enUsResource);

  if (loading) {
    return <PageSpinner label={t("generic:title")} />;
  }

  // Display a simpler error page if we can't load navigation
  if (error) {
    return (
      <main
        css={s(gutter, {
          textAlign: "center",
        })}
      >
        <div css={s(belt, { maxWidth: 540 })}>
          <h1 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            {t("generic:title")}
          </h1>
          <p
            css={s(bodyText, (t) => ({
              marginBottom: t.spacing.md,
            }))}
          >
            <Trans
              components={{
                Email: (
                  <a
                    css={s((t) => ({
                      _fontWeight: t.font.primary.weight.medium,
                      textDecoration: "underline",
                    }))}
                    href={`mailto:${t("common:footer.links.email")}`}
                  />
                ),
              }}
              i18nKey="generic:info"
              values={{ email: t("common:footer.links.email") }}
            />
          </p>
          <p>
            <Trans
              components={{
                Link: (
                  <a
                    css={s((t) => ({
                      _fontWeight: t.font.primary.weight.medium,
                      textDecoration: "underline",
                    }))}
                    href="/"
                  />
                ),
              }}
              i18nKey="generic:home"
            />
          </p>
        </div>
      </main>
    );
  }

  return (
    <Standard>
      <main css={s({ textAlign: "center" })}>
        <Grid itemWidth={[percentage(1), null, percentage(1 / 2)]}>
          <Item
            _css={s({
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            })}
          >
            <div css={s(gutter, (t) => py([t.spacing.xxl, null, 0]))}>
              <div css={s(belt, { maxWidth: 540 })}>
                <h1
                  css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}
                >
                  {t("generic:title")}
                </h1>
                <p
                  css={s(bodyText, (t) => ({
                    marginBottom: [t.spacing.lg, null, t.spacing.xl],
                  }))}
                >
                  <Trans
                    components={{
                      Email: (
                        <a
                          css={s((t) => ({
                            _fontWeight: t.font.primary.weight.medium,
                            textDecoration: "underline",
                          }))}
                          href={`mailto:${t("common:footer.links.email")}`}
                        />
                      ),
                    }}
                    i18nKey="generic:info"
                    values={{ email: t("common:footer.links.email") }}
                  />
                </p>
              </div>
            </div>
          </Item>
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
                src={ERROR_IMG}
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
                src={ERROR_IMG}
              />
            </div>
          </Item>
        </Grid>
      </main>
    </Standard>
  );
};

export default Generic;
