import React from "react";

import { beltTight, s } from "@/common/ui/utils";

import VideoBackground from ".";

export default {
  title: "Components/VideoBackground",
};

export const Default = () => (
  <div css={s(beltTight)}>
    <VideoBackground
      _css={s({ width: "100%" })}
      poster="https://www.placecage.com/720/900"
      urls={["https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"]}
    />
  </div>
);
