import React from "react";

import { belt, s } from "@/common/ui/utils";

import LOGO_FOREST from "../../../assets/images/common/LOGO_FOREST.png";
import { headingAlpha } from "../typography";
import FeatureLayout from ".";

export default {
  title: "Components/FeatureLayout",
};

export const Single = () => (
  <section css={s(belt)}>
    <FeatureLayout
      direction="ltr"
      height={[null, null, 500, 600, 640]}
      image={LOGO_FOREST}
    >
      <h2 css={s(headingAlpha)}>{name} </h2>
    </FeatureLayout>
  </section>
);
