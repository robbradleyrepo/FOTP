import { YouTubeSlice } from "@sss/prismic";
import { stringify } from "querystring";
import React, { FC } from "react";

import { ratio, s } from "@/common/ui/utils";

import { useCmsLayout } from "../../layout";

const qs = stringify({
  modestbranding: 1,
  origin: process.env.ORIGIN,
  rel: 0,
});

const YouTubeRenderer: FC<YouTubeSlice> = ({ primary: { videoId } }) => {
  const {
    styles: { belt, mb },
  } = useCmsLayout();

  return (
    <div css={s(belt, mb, ratio(9 / 16))}>
      <iframe src={`https://www.youtube.com/embed/${videoId}?${qs}`} />
    </div>
  );
};

export default YouTubeRenderer;
