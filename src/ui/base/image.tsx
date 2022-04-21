import styled from "styled-components";

import Box from "./box";

export const img = {
  maxWidth: "100%",
};

interface ImageProps {
  alt: string; // Make `alt` a required prop for better accessibility
  loading?: "lazy" | "eager"; // Make loading required for perf
}

/** @deprecated Use `ResponsiveImage` instead */
const Image = styled(Box)<ImageProps>``;

Image.defaultProps = {
  ...Image.defaultProps,
  _maxWidth: "100%",
};

export default Image;
