import { useDateTimeFormatter, useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { documentResolver, hasContent, Person } from "@sss/prismic";
import { RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";
import { ExpertCore } from "src/cms/common";
import { bodyTextSmall, headingEcho } from "src/ui/base/typography";

import {
  ComponentStyleProps,
  py,
  ResponsiveImageProperties,
  s,
  size,
} from "@/common/ui/utils";
import { ArticlePage } from "@/modules/articles/article-queries";

import { useCmsLayout } from "../../../cms/layout";
import Icon from "../../base/icon";
import ResponsiveImage from "../../base/responsive-image";
import { bodyTextStatic, headingAlpha, textLink } from "../../base/typography";
import tick from "../../icons/tick";

type ArticleAuthorProps = ComponentStyleProps & {
  imageCss?: ComponentStyleProps["_css"];
  sizes?: ResponsiveImageProperties | string;
} & {
  author: ExpertCore | Person;
  checked?: boolean;
  label: string;
  imageUrl?: string;
};

const ArticleAuthor: FC<ArticleAuthorProps> = ({
  _css = {},
  author,
  children,
  checked = false,
  imageUrl,
  imageCss = {},
  label,
}) => {
  const authorMarkup = (
    <div css={s({ display: "flex" }, _css)}>
      {imageUrl && (
        <div
          css={s(
            (t) => ({
              ...size([40, null, 48]),
              borderRadius: t.radius.xxl,
              flexGrow: 0,
              flexShrink: 0,
              marginRight: t.spacing.sm,
              overflow: "hidden",
            }),
            imageCss
          )}
        >
          <ResponsiveImage
            alt=""
            height={256}
            loading="lazy"
            src={imageUrl}
            sizes={{ width: [40, null, 48] }}
            width={256}
          />
          {checked && (
            <div
              css={s((t) => ({
                alignItems: "center",
                backgroundColor: t.color.border.selected,
                borderRadius: "50%",
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                left: -5,
                position: "absolute",
                ...size(20),
              }))}
            >
              <Icon
                _css={s(size(12), (t) => ({
                  color: t.color.background.base,
                }))}
                path={tick}
                title="Twitter"
                viewBox="0 0 100 100"
              />
            </div>
          )}
        </div>
      )}
      {hasContent(author.name) && (
        <div
          css={s({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          })}
        >
          <p css={s(bodyTextSmall, { fontSize: 12, lineHeight: "14px" })}>
            {label}
          </p>
          <p
            css={s(headingEcho, {
              letterSpacing: "0.03em",
            })}
          >
            <RichTextFragment render={author.name} />
          </p>
        </div>
      )}
      {children}
    </div>
  );

  if ("postNominal" in author) {
    return (
      <Link css={s(textLink)} to={documentResolver(author)}>
        {authorMarkup}
      </Link>
    );
  }

  return authorMarkup;
};

type ArticlePageHeaderProps = ComponentStyleProps & ArticlePage;

const ArticlePageHeader: FC<ArticlePageHeaderProps> = ({
  _css = {},
  author,
  approver,
  publicationDate,
  title,
}) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();
  const formatDateTime = useDateTimeFormatter();
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ArticlePageHeader", {
    approver: "Medically approved by",
    author: "Written by",
    lastUpdated: "Last updated",
  });

  return (
    <header css={s(gutterX, mb, _css)}>
      <div css={s(belt)}>
        {title && (
          <h1
            css={s(headingAlpha, (t) => ({
              marginBottom: t.spacing.xs,
              paddingTop: [t.spacing.lg, null, t.spacing.xl],
            }))}
          >
            <RichTextFragment render={title} />
          </h1>
        )}
        <div
          css={s(bodyTextStatic, (t) => ({
            alignItems: ["end", null, "center"],
            borderBottom: `solid 1px ${t.color.tint.algae}`,
            borderTop: `solid 1px ${t.color.tint.algae}`,
            display: "flex",
            marginBottom: [t.spacing.lg, null, t.spacing.xl],
            marginTop: [t.spacing.md, null, t.spacing.xl],
            ...py(t.spacing.md),
          }))}
        >
          <div
            css={s({
              display: "flex",
              flexDirection: ["column", null, "row"],
              flexGrow: 1,
              justifyContent: "start",
            })}
          >
            {author && (
              <ArticleAuthor
                _css={s((t) => ({
                  marginRight: t.spacing.md,
                }))}
                author={author}
                imageUrl={author.image?.url}
                label={t("ArticlePageHeader:author")}
              />
            )}
            {approver && (
              <ArticleAuthor
                _css={s((t) => ({
                  marginRight: t.spacing.md,
                  marginTop: [t.spacing.sm, null, 0],
                  position: "relative",
                }))}
                author={approver}
                checked
                imageUrl={approver.image?.url}
                label={t("ArticlePageHeader:approver")}
              />
            )}
          </div>
          {publicationDate && (
            <div
              css={s({
                flexShrink: 0,
              })}
            >
              <p
                css={s(bodyTextSmall, {
                  fontSize: 12,
                  lineHeight: "12px",
                  textAlign: "right",
                })}
              >
                {t("ArticlePageHeader:lastUpdated")}
              </p>
              <time
                css={s(bodyTextSmall, (t) => ({
                  fontWeight: t.font.primary.weight.medium,
                  marginTop: t.spacing.sm,
                }))}
                dateTime={publicationDate}
              >
                {formatDateTime(publicationDate, {
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC", // Dates without times are parsed as UTC midnight
                  year: "numeric",
                })}
              </time>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArticlePageHeader;
