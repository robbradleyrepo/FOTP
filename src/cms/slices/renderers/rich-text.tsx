import { RichTextSlice } from "@sss/prismic";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import { bodyText } from "../../../ui/base/typography";
import { useCmsLayout } from "../../layout";
import { OpinionatedRichText } from "../../prismic";

const RichTextRenderer: FC<RichTextSlice> = ({ primary: { content } }) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();

  return (
    <div css={s(belt, gutterX, mb, bodyText)}>
      <OpinionatedRichText render={content} />
    </div>
  );
};

export default RichTextRenderer;
