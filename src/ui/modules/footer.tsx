import { useQuery } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { trackSelectItemEvent } from "@sss/ecommerce/analytics";
import {
  COLLECTION_NAVIGATION,
  CollectionData,
} from "@sss/ecommerce/collection";
import { ProductCore } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { belt, gutter, mx, s, size, useTheme } from "@/common/ui/utils";

import { THEMES_ENGINE } from "../../config";
import { Grid, Item } from "../base/grid";
import Icon from "../base/icon";
import Logo from "../base/logo";
import {
  bodyTextSmall,
  bodyTextSmallStatic,
  textLink,
} from "../base/typography";
import heart from "../icons/heart";
import PreFooter from "./prefooter";

const footerHeadingStyle = s(bodyTextSmall, (t) => ({
  borderBottom: "1px solid #fff",
  display: "inline-block",
  fontSize: 12,
  letterSpacing: "0.15em",
  marginBottom: t.spacing.lg,
  textTransform: "uppercase",
}));

const Footer: FC = () => {
  const { t } = useLocale();
  const { data, loading } = useQuery<CollectionData<ProductCore>>(
    COLLECTION_NAVIGATION
  );
  const theme = useTheme();

  if (loading) {
    const error = new Error(
      "Missing global product data - make sure the `COLLECTION_NAVIGATION` query has been pre-populated during `getStaticProps`"
    );

    if (process.env.NODE_ENV === "production") {
      captureException(error);
    } else if (process.env.NODE_ENV !== "test") {
      throw error;
    }

    return null;
  }

  if (!data) {
    throw new Error("Missing global product data");
  }

  const {
    collection: { products },
  } = data;

  return (
    <>
      <PreFooter />
      <footer
        css={s(gutter, (t) => ({
          backgroundColor: t.color.background.dark,
          color: t.color.text.light.base,
          paddingBottom: 0,
          paddingTop: [t.spacing.xxl, null, 96],
        }))}
      >
        <div
          css={s(belt, {
            maxWidth: 1440,
          })}
        >
          <Grid
            gx={[theme.spacing.md, null, theme.spacing.xxl, 96]}
            gy={theme.spacing.xxl}
            direction="rtl"
          >
            <Item width={["100%", null, null, "30%"]}>
              <div
                css={s((t) => ({
                  marginBottom: t.spacing.lg,
                  width: 80,
                }))}
              >
                <Logo fill={theme.color.text.light.base} />
              </div>
              <p css={s(bodyTextSmallStatic)}>
                <Trans
                  components={{
                    Love: (
                      <Icon
                        _css={s(mx(2), size(14))}
                        path={heart}
                        title={t("common:footer.love.emoji")}
                        viewBox="0 0 14 12"
                      />
                    ),
                  }}
                  i18nKey="common:footer.love.text"
                />
              </p>
              <p
                css={s(bodyTextSmallStatic, (t) => ({
                  marginTop: t.spacing.sm,
                }))}
              >
                <Trans
                  components={{
                    Email: (
                      <a
                        css={s({ textDecoration: "underline" })}
                        href={`mailto:${t("common:email")}`}
                      />
                    ),
                    Phone: <a href="tel:+13239225737" />,
                  }}
                  i18nKey="common:footer.contact"
                />
              </p>
              <p
                css={s(bodyTextSmallStatic, (t) => ({
                  marginTop: t.spacing.sm,
                }))}
              >
                6060 Center Drive,
                <br />
                Ste 69, Fl 10,
                <br /> Los Angeles, CA 90045
              </p>
            </Item>

            <Item width={["100%", null, null, "70%"]}>
              <Grid
                gx={[theme.spacing.md, null, theme.spacing.xl]}
                gy={theme.spacing.xl}
                itemWidth={["50%", null, "25%"]}
              >
                <Item>
                  <h2 css={footerHeadingStyle}>
                    <Trans i18nKey="common:footer.titles.shop" />
                  </h2>
                  <ul>
                    <li css={s((t) => ({ marginBottom: t.spacing.xs }))}>
                      <Link css={textLink} to="/food">
                        {t("common:footer.links.food")}
                      </Link>
                    </li>
                    {products.edges.map(({ node }) => (
                      <li
                        css={s((t) => ({ marginBottom: t.spacing.xs }))}
                        key={node.id}
                      >
                        <Link
                          css={textLink}
                          onClick={() => trackSelectItemEvent(node, "Footer")}
                          to={`/products/${node.handle}`}
                        >
                          {node.title}
                        </Link>
                      </li>
                    ))}
                    {[
                      { handle: "/collections/treats", label: "treats" },
                      { handle: "/products", label: "shopAll" },
                    ].map(({ handle, label }) => (
                      <li
                        css={s((t) => ({ marginBottom: t.spacing.xs }))}
                        key={handle}
                      >
                        <Link css={textLink} to={handle}>
                          {t(`common:footer.links.${label}`)}
                        </Link>
                      </li>
                    ))}
                    <li css={s((t) => ({ marginBottom: t.spacing.xs }))}>
                      <a css={textLink} href={THEMES_ENGINE.urls.account}>
                        {t("common:footer.links.account")}
                      </a>
                    </li>
                  </ul>
                </Item>
                <Item>
                  <h2 css={footerHeadingStyle}>
                    <Trans i18nKey="common:footer.titles.science" />
                  </h2>
                  <ul>
                    {[
                      { handle: "/science", label: "approach" },
                      { handle: "/science/ingredients", label: "ingredients" },
                      { handle: "/science/evidence", label: "evidence" },
                      { handle: "/science/experts", label: "experts" },
                      {
                        handle: "/science/testing-and-transparency",
                        label: "testing",
                      },
                    ].map(({ handle, label }) => (
                      <li
                        css={s((t) => ({ marginBottom: t.spacing.xs }))}
                        key={handle}
                      >
                        <Link css={textLink} to={handle}>
                          {t(`common:footer.links.${label}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Item>
                <Item>
                  <h2 css={footerHeadingStyle}>
                    <Trans i18nKey="common:footer.titles.about" />
                  </h2>
                  <ul>
                    {[
                      { handle: "/mission", label: "story" },
                      {
                        handle: "/mission/supporting-shelters",
                        label: "shelters",
                      },
                      {
                        handle: "/mission/sustainability",
                        label: "sustainability",
                      },
                      { handle: "/reviews", label: "reviews" },
                      {
                        handle: "/reviews/video-testimonials",
                        label: "testimonials",
                      },
                    ].map(({ handle, label }) => (
                      <li
                        css={s((t) => ({ marginBottom: t.spacing.xs }))}
                        key={handle}
                      >
                        <Link css={textLink} to={handle}>
                          {t(`common:footer.links.${label}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Item>
                <Item>
                  <h2 css={footerHeadingStyle}>
                    <Trans i18nKey="common:footer.titles.help" />
                  </h2>
                  <ul>
                    {[
                      { handle: "/help/faq", label: "faq" },
                      { handle: "/help/contact", label: "contact" },
                      { handle: "/work-with-us", label: "workwithus" },
                      { handle: "/refund", label: "refunds" },
                      { handle: "/shipping", label: "shipping" },
                      { handle: "/help/for-veterinarians", label: "vet" },
                      { handle: "/blog", label: "blog" },
                    ].map(({ handle, label }) => (
                      <li
                        css={s((t) => ({ marginBottom: t.spacing.xs }))}
                        key={handle}
                      >
                        <Link css={textLink} to={handle}>
                          {t(`common:footer.links.${label}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Item>
              </Grid>
            </Item>
          </Grid>

          <div
            css={s((t) => ({
              alignItems: "center",
              display: ["block", null, "flex"],
              paddingBottom: t.spacing.xxl,
              paddingTop: [t.spacing.xl, null, 96],
            }))}
          >
            <div
              css={s((t) => ({
                border: "1px solid #fff",
                marginBottom: [t.spacing.lg, null, 0],
                maxWidth: 550,
                ...mx(["auto", null, null, 0]),
                opacity: "0.6",
                padding: t.spacing.sm,
                textAlign: ["center", null, "left"],
              }))}
            >
              <p css={s(bodyTextSmallStatic, { fontSize: 12 })}>
                {t("common:footer.fda")}
              </p>
            </div>

            <div
              css={s((t) => ({
                marginLeft: [0, null, t.spacing.xl, t.spacing.xxl],
                textAlign: ["center", null, "left"],
              }))}
            >
              <span
                css={s(bodyTextSmallStatic, (t) => ({
                  display: ["block", null, "inline"],
                  fontSize: 12,
                  marginRight: [0, null, t.spacing.xs],
                }))}
              >
                <span
                  css={s((t) => ({
                    display: ["block", null, "inline"],
                    marginBottom: [t.spacing.md, null, 0],
                    whiteSpace: "nowrap",
                  }))}
                >
                  {t("common:footer.copyright")}
                </span>
              </span>
              {[
                {
                  handle: "/terms-of-service",
                  label: "common:footer.links.terms",
                },
                {
                  handle: "/privacy",
                  label: "common:footer.links.privacy",
                },
              ].map(({ handle, label }) => (
                <Link
                  css={s(bodyTextSmallStatic, (t) => ({
                    fontSize: 12,
                    ...mx(t.spacing.xs),
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                  }))}
                  key={handle}
                  to={handle}
                >
                  {t(label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
