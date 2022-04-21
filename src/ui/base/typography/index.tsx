import styled from "styled-components";

import { s, StyleFn, unresponsiveTypography } from "@/common/ui/utils";

import { font } from "../../styles/variables";
import Box from "../box";

export const BodyText = styled(Box)``;

BodyText.defaultProps = {
  ...BodyText.defaultProps,
  _fontFamily: font.primary.family,
  _fontSize: [16, null, 18],
  _fontWeight: font.primary.weight.book,
  _lineHeight: ["24px", null, "28px"],
};

export const bodyText: StyleFn = (t) => ({
  fontFamily: t.font.primary.family,
  fontSize: [16, null, 18],
  fontWeight: t.font.primary.weight.book,
  lineHeight: ["24px", null, "28px"],
});

export const bodyTextStatic = unresponsiveTypography(bodyText);

export const BodyTextSmall = styled(BodyText)``;

BodyTextSmall.defaultProps = {
  ...BodyTextSmall.defaultProps,
  _fontSize: [14, null, 16],
  _lineHeight: "21px",
};

export const bodyTextSmall = s(bodyText, {
  fontSize: [14, null, 16],
  lineHeight: "21px",
});

export const bodyTextSmallStatic = unresponsiveTypography(bodyTextSmall);

export const BodyTextExtraSmall = styled(BodyText)``;

BodyTextExtraSmall.defaultProps = {
  ...BodyTextExtraSmall.defaultProps,
  _fontSize: [11, null, 12],
  _letterSpacing: "0.18em",
  _lineHeight: ["21px", null, null, null, "16px"],
  _textTransform: "uppercase",
};

export const bodyTextExtraSmall = s(bodyText, {
  fontSize: [11, null, 12],
  letterSpacing: "0.18em",
  lineHeight: ["21px", null, null, null, "16px"],
  textTransform: "uppercase",
});

export const bodyTextExtraSmallStatic = unresponsiveTypography(
  bodyTextExtraSmall
);

export const CallToActionText = styled(Box)``;

CallToActionText.defaultProps = {
  ...CallToActionText.defaultProps,
  _fontFamily: font.secondary.family,
  _fontSize: 14,
  _fontWeight: font.secondary.weight.bold,
  _letterSpacing: "0.12em",
  _lineHeight: 1,
  _textTransform: "uppercase",
};

export const callToActionText: StyleFn = (t) => ({
  fontFamily: t.font.secondary.family,
  fontSize: 14,
  fontWeight: t.font.secondary.weight.bold,
  letterSpacing: "0.12em",
  lineHeight: 1,
  textTransform: "uppercase",
});

export const callToActionTextStatic = unresponsiveTypography(callToActionText);

export const HeadingAlpha = styled(Box)``;

HeadingAlpha.defaultProps = {
  ...HeadingAlpha.defaultProps,
  _fontFamily: font.secondary.family,
  _fontSize: [36, null, 42, 48],
  _fontWeight: font.secondary.weight.bold,
  _letterSpacing: "-0.05em",
  _lineHeight: ["38px", null, "48px", "54px"],
};

export const headingAlpha: StyleFn = (t) => ({
  fontFamily: t.font.secondary.family,
  fontSize: [36, null, 42, 48],
  fontWeight: t.font.secondary.weight.bold,
  letterSpacing: "-0.05em",
  lineHeight: ["38px", null, "48px", "54px"],
});

export const headingAlphaStatic = unresponsiveTypography(headingAlpha);

export const HeadingBravo = styled(HeadingAlpha)``;

HeadingBravo.defaultProps = {
  ...HeadingBravo.defaultProps,
  _fontSize: [28, null, 32, 36],
  _letterSpacing: "-0.05em",
  _lineHeight: ["32px", null, "36px", "44px"],
};

export const headingBravo = s(headingAlpha, {
  fontSize: [28, null, 32, 36],
  letterSpacing: "-0.05em",
  lineHeight: ["32px", null, "36px", "44px"],
});

export const headingBravoStatic = unresponsiveTypography(headingBravo);

export const HeadingCharlie = styled(HeadingBravo)``;

HeadingCharlie.defaultProps = {
  ...HeadingCharlie.defaultProps,
  _fontSize: [22, null, 28],
  _letterSpacing: "-0.05em",
  _lineHeight: ["28px", null, "32px"],
};

export const headingCharlie = s(headingBravo, {
  fontSize: [22, null, 28],
  letterSpacing: "-0.05em",
  lineHeight: ["28px", null, "32px"],
});

export const headingCharlieStatic = unresponsiveTypography(headingCharlie);

export const HeadingDelta = styled(HeadingCharlie)``;

HeadingDelta.defaultProps = {
  ...HeadingDelta.defaultProps,
  _fontSize: [18, null, 22],
  _fontWeight: font.primary.weight.medium,
  _letterSpacing: "-0.03em",
  _lineHeight: 1,
};

export const headingDelta = s(headingCharlie, (t) => ({
  fontSize: [18, null, 22],
  fontWeight: t.font.primary.weight.medium,
  letterSpacing: "-0.03em",
  lineHeight: 1,
}));

export const headingDeltaStatic = unresponsiveTypography(headingDelta);

export const HeadingEcho = styled(HeadingDelta)``;

HeadingEcho.defaultProps = {
  ...HeadingEcho.defaultProps,
  _fontSize: [14, null, 16],
  _lineHeight: "20px",
};

export const headingEcho = s(headingDelta, {
  fontSize: [14, null, 16],
  lineHeight: "20px",
});

export const headingEchoStatic = unresponsiveTypography(headingEcho);

export const textLink = s({
  ":hover": {
    textDecoration: "underline",
  },
  fontFamily: font.secondary.family,
  textDecoration: "none",
});
