import React from "react";

import { s } from "@/common/ui/utils";

import { bodyText, headingAlpha } from "../typography";
import Accordion from ".";

export default {
  title: "Components/Accordion",
};

export const Default = () => (
  <>
    <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
      Accordion
    </h2>
    <div css={s({ maxWidth: 800 })}>
      <Accordion
        id="accordion0"
        initiallyOpen
        label="An accordion item"
        labelAs="h3"
      >
        <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
          This content is initially visible because its{" "}
          <code>initiallyOpen</code> prop is <code>true</code>.
        </p>
      </Accordion>
      <Accordion id="accordion1" label="Another accordion item" labelAs="h3">
        <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
          This content is hidden until the user clicks on the label.
        </p>
      </Accordion>
    </div>
  </>
);
