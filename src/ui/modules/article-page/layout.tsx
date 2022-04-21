import React, { FC } from "react";

import { belt as _belt, gutterX, s, StyleFn } from "@/common/ui/utils";
import { ArticlePage } from "@/modules/articles/article-queries";

import {
  CmsLayoutMaxWidth,
  CmsLayoutProvider,
  CmsLayoutStyles,
} from "../../../cms/layout";
import Header from "./header";

const maxWidth: CmsLayoutMaxWidth = {
  primary: 680,
  secondary: 680,
};
const mb: StyleFn = (t) => ({
  marginBottom: [t.spacing.lg, null, t.spacing.xl],
});

const styles: CmsLayoutStyles = {
  belt: s(_belt, { maxWidth: maxWidth.primary }),
  gutterX,
  mb,
  paddingX: gutterX,
};

const ArticlePageLayout: FC<ArticlePage> = ({ children, ...rest }) => {
  return (
    <CmsLayoutProvider maxWidth={maxWidth} styles={styles}>
      <Header {...rest} />
      {children}
    </CmsLayoutProvider>
  );
};

export default ArticlePageLayout;
