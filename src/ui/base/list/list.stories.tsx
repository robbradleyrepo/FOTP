import React from "react";

import { s } from "@/common/ui/utils";
import { gutter } from "@/common/ui/utils";

import { bodyText } from "../typography";
import { decorativeListItem } from ".";

export default {
  title: "Styles/Lists",
};

export const Unordered = () => (
  <div css={s(gutter)}>
    <ul css={s(bodyText)}>
      <li css={s(decorativeListItem)}>item 1</li>
      <li css={s(decorativeListItem)}>item 2</li>
      <li css={s(decorativeListItem)}>item 3</li>
      <li css={s(decorativeListItem)}>item 4</li>
    </ul>
  </div>
);
