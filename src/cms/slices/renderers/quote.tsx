import { QuoteSlice, RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import Blockquote from "../../../ui/base/blockquote";
import { useCmsLayout } from "../../layout";

const QuoteRenderer: FC<QuoteSlice> = ({ primary: { attribution, quote } }) => {
  const {
    styles: { belt, gutterX, mb },
  } = useCmsLayout();

  return quote ? (
    <div css={s(belt, gutterX, mb)}>
      <Blockquote
        attribution={attribution && <RichTextFragment render={attribution} />}
      >
        <RichTextFragment render={quote} />
      </Blockquote>
    </div>
  ) : null;
};

export default QuoteRenderer;
