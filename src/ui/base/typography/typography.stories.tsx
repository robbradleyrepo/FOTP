import React from "react";

import { s } from "@/common/ui/utils";

import {
  bodyText,
  bodyTextExtraSmall,
  bodyTextExtraSmallStatic,
  bodyTextSmall,
  bodyTextSmallStatic,
  bodyTextStatic,
  callToActionText,
  callToActionTextStatic,
  headingAlpha,
  headingAlphaStatic,
  headingBravo,
  headingBravoStatic,
  headingCharlie,
  headingCharlieStatic,
  headingDelta,
  headingDeltaStatic,
  headingEcho,
  headingEchoStatic,
} from "./index";

export default {
  title: "Styles/Typography",
};

export const AllTypography = () => (
  <div
    css={s((t) => ({
      "& > *": {
        marginBottom: t.spacing.lg,
      },
    }))}
  >
    <p css={s(headingAlpha)}>Heading Alpha</p>
    <p css={s(headingBravo)}>Heading Bravo</p>
    <p css={s(headingCharlie)}>Heading Charlie</p>
    <p css={s(headingDelta)}>Heading Delta</p>
    <p css={s(headingEcho)}>Heading Echo</p>
    <p css={s(bodyText)}>
      Body Text: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent sed cursus mi. Sed id leo iaculis, auctor libero non, fermentum
      dui. Vivamus dapibus in mauris at vehicula. Cras condimentum sit amet
      lacus quis pretium. Pellentesque in libero eu sem eleifend facilisis.
      Vivamus ac consequat quam. Morbi commodo sollicitudin dictum. Nam sit amet
      mauris id velit viverra gravida vitae sed mi. Aliquam erat volutpat. Etiam
      id porta felis.
    </p>
    <p css={s(bodyTextSmall)}>
      Body Text Small: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Proin mattis mollis cursus. Praesent ultrices mattis lorem eget egestas.
      Integer nec libero convallis, ultrices quam id, fringilla lorem. Integer
      at est malesuada, facilisis lacus a, lobortis mauris. In pulvinar finibus
      felis vel placerat. Donec et luctus lorem. Etiam auctor eros a varius
      vulputate. Donec mi diam, laoreet et mauris ut, laoreet aliquam felis.
      Nulla sed felis ac est vulputate facilisis. Donec tempor malesuada ante,
      vitae dignissim erat efficitur eu. Duis a ligula posuere, cursus nisi nec,
      porta elit.
    </p>
    <p css={s(bodyTextExtraSmall)}>
      Body Text Extra Small: Lorem ipsum dolor sit amet, consectetur adipiscing
      elit. Phasellus quam sapien, feugiat ut interdum et, ullamcorper vel
      ipsum. Morbi ullamcorper ultricies leo sed pharetra. Duis quis leo sit
      amet velit facilisis tristique. Nulla in magna efficitur, cursus purus id,
      faucibus lacus. Ut massa orci, ornare a lacus at, rhoncus fringilla est.
      Cras elementum scelerisque sem, in faucibus quam maximus eu. In ut ante
      quis erat posuere pretium vitae ut est. Nunc malesuada velit est, vitae
      fringilla urna elementum id. Quisque hendrerit luctus dui. Nulla
      vestibulum pulvinar eros nec tincidunt.
    </p>
    <a href="" css={s(callToActionText)}>
      Call to Action Text
    </a>
  </div>
);

export const HeadingAlpha = () => <p css={s(headingAlpha)}>Heading Alpha</p>;
export const HeadingBravo = () => <p css={s(headingBravo)}>Heading Bravo</p>;
export const HeadingCharlie = () => (
  <p css={s(headingCharlie)}>Heading Charlie</p>
);
export const HeadingDelta = () => <p css={s(headingDelta)}>Heading Delta</p>;
export const HeadingEcho = () => <p css={s(headingEcho)}>Heading Echo</p>;
export const BodyText = () => (
  <p css={s(bodyText)}>
    Body Text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
    sed cursus mi. Sed id leo iaculis, auctor libero non, fermentum dui. Vivamus
    dapibus in mauris at vehicula. Cras condimentum sit amet lacus quis pretium.
    Pellentesque in libero eu sem eleifend facilisis. Vivamus ac consequat quam.
    Morbi commodo sollicitudin dictum. Nam sit amet mauris id velit viverra
    gravida vitae sed mi. Aliquam erat volutpat. Etiam id porta felis.
  </p>
);
export const BodyTextSmall = () => (
  <p css={s(bodyTextSmall)}>
    Body Text Small: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Proin mattis mollis cursus. Praesent ultrices mattis lorem eget egestas.
    Integer nec libero convallis, ultrices quam id, fringilla lorem. Integer at
    est malesuada, facilisis lacus a, lobortis mauris. In pulvinar finibus felis
    vel placerat. Donec et luctus lorem. Etiam auctor eros a varius vulputate.
    Donec mi diam, laoreet et mauris ut, laoreet aliquam felis. Nulla sed felis
    ac est vulputate facilisis. Donec tempor malesuada ante, vitae dignissim
    erat efficitur eu. Duis a ligula posuere, cursus nisi nec, porta elit.
  </p>
);
export const BodyTextExtraSmall = () => (
  <p css={s(bodyTextExtraSmall)}>
    Body Text Extra Small: Lorem ipsum dolor sit amet, consectetur adipiscing
    elit. Phasellus quam sapien, feugiat ut interdum et, ullamcorper vel ipsum.
    Morbi ullamcorper ultricies leo sed pharetra. Duis quis leo sit amet velit
    facilisis tristique. Nulla in magna efficitur, cursus purus id, faucibus
    lacus. Ut massa orci, ornare a lacus at, rhoncus fringilla est. Cras
    elementum scelerisque sem, in faucibus quam maximus eu. In ut ante quis erat
    posuere pretium vitae ut est. Nunc malesuada velit est, vitae fringilla urna
    elementum id. Quisque hendrerit luctus dui. Nulla vestibulum pulvinar eros
    nec tincidunt.
  </p>
);
export const CallToActionText = () => (
  <a href="" css={s(callToActionText)}>
    Call to Action Text
  </a>
);

export const AllTypographyStatic = () => (
  <div
    css={s((t) => ({
      "& > *": {
        marginBottom: t.spacing.lg,
      },
    }))}
  >
    <p css={s(headingAlphaStatic)}>Heading Alpha</p>
    <p css={s(headingBravoStatic)}>Heading Bravo</p>
    <p css={s(headingCharlieStatic)}>Heading Charlie</p>
    <p css={s(headingDeltaStatic)}>Heading Delta</p>
    <p css={s(headingEchoStatic)}>Heading Echo</p>
    <p css={s(bodyTextStatic)}>
      Body Text: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent sed cursus mi. Sed id leo iaculis, auctor libero non, fermentum
      dui. Vivamus dapibus in mauris at vehicula. Cras condimentum sit amet
      lacus quis pretium. Pellentesque in libero eu sem eleifend facilisis.
      Vivamus ac consequat quam. Morbi commodo sollicitudin dictum. Nam sit amet
      mauris id velit viverra gravida vitae sed mi. Aliquam erat volutpat. Etiam
      id porta felis.
    </p>
    <p css={s(bodyTextSmallStatic)}>
      Body Text Small: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Proin mattis mollis cursus. Praesent ultrices mattis lorem eget egestas.
      Integer nec libero convallis, ultrices quam id, fringilla lorem. Integer
      at est malesuada, facilisis lacus a, lobortis mauris. In pulvinar finibus
      felis vel placerat. Donec et luctus lorem. Etiam auctor eros a varius
      vulputate. Donec mi diam, laoreet et mauris ut, laoreet aliquam felis.
      Nulla sed felis ac est vulputate facilisis. Donec tempor malesuada ante,
      vitae dignissim erat efficitur eu. Duis a ligula posuere, cursus nisi nec,
      porta elit.
    </p>
    <p css={s(bodyTextExtraSmallStatic)}>
      Body Text Extra Small: Lorem ipsum dolor sit amet, consectetur adipiscing
      elit. Phasellus quam sapien, feugiat ut interdum et, ullamcorper vel
      ipsum. Morbi ullamcorper ultricies leo sed pharetra. Duis quis leo sit
      amet velit facilisis tristique. Nulla in magna efficitur, cursus purus id,
      faucibus lacus. Ut massa orci, ornare a lacus at, rhoncus fringilla est.
      Cras elementum scelerisque sem, in faucibus quam maximus eu. In ut ante
      quis erat posuere pretium vitae ut est. Nunc malesuada velit est, vitae
      fringilla urna elementum id. Quisque hendrerit luctus dui. Nulla
      vestibulum pulvinar eros nec tincidunt.
    </p>
    <a href="" css={s(callToActionTextStatic)}>
      Call to Action Text
    </a>
  </div>
);
