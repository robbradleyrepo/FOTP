import { useDateTimeFormatter } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import React, { ComponentType, FC } from "react";
import ResponsiveImage from "src/ui/base/responsive-image";

import {
  ComponentStyleProps,
  ratio,
  ResponsiveImageProperties,
  s,
  size,
} from "@/common/ui/utils";
import { ArticlePageCore } from "@/modules/articles/article-queries";

import StyledComponentsHelper from "../../base/styled-components-helper";
import { headingCharlie } from "../../base/typography";
import Author from "../author";

type ArticlePageListingItemProps = ComponentStyleProps &
  ArticlePageCore & {
    labelAs?: keyof JSX.IntrinsicElements | ComponentType;
    sizes: ResponsiveImageProperties | string;
  };

const ArticlePageListingItem: FC<ArticlePageListingItemProps> = ({
  _css = {},
  author,
  labelAs = "h2",
  publicationDate,
  sizes,
  summary,
  thumbnail,
  title,
}) => {
  const formatDateTime = useDateTimeFormatter();

  return (
    <article css={s(_css)}>
      {thumbnail && (
        <div
          css={s(ratio(2 / 3), (t) => ({
            borderRadius: t.radius.sm,
            marginBottom: t.spacing.md,
            overflow: "hidden",
          }))}
        >
          <ResponsiveImage
            alt=""
            layout="fill"
            objectFit="cover"
            src={thumbnail.url}
            sizes={sizes}
          />
        </div>
      )}
      {title && (
        <StyledComponentsHelper
          as={labelAs}
          css={s(headingCharlie, (t) => ({ marginBottom: t.spacing.xs }))}
        >
          <RichTextFragment render={title} />
        </StyledComponentsHelper>
      )}
      {summary && <p>{summary}</p>}
      {author && (
        <Author
          _css={s((t) => ({
            flexShrink: 0,
            marginRight: t.spacing.sm,
            marginTop: t.spacing.sm,
          }))}
          image={author.image}
          imageCss={s((t) => ({ ...size(48), marginRight: t.spacing.sm }))}
          name={author.name}
          sizes={{ width: 48 }}
        >
          {publicationDate && (
            <time
              css={s((t) => ({
                flexShrink: 0,
                marginTop: t.spacing.sm,
              }))}
              dateTime={publicationDate}
            >
              {formatDateTime(publicationDate, {
                day: "numeric",
                month: "long",
                timeZone: "UTC", // Dates without times are parsed as UTC midnight
                year: "numeric",
              })}
            </time>
          )}
        </Author>
      )}
    </article>
  );
};

export default ArticlePageListingItem;
