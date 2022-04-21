import { createGlobalStyle } from "styled-components";

import { color, font } from "./variables";

const GlobalStyles = createGlobalStyle`
  blockquote,
  dd,
  dl,
  dt,
  fieldset,
  figure,
  figcaption,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  legend,
  li,
  p,
  ol,
  td,
  th,
  ul {
    font: inherit;
    margin: 0;
    padding: 0;
  }

  button,
  fieldset,
  input,
  legend,
  select,
  textarea {
    appearance: none;
    color: inherit;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font: inherit;
    padding: 0;
    text-align: inherit;
    text-decoration: inherit;
  }

  button {
    cursor: pointer;
    text-transform: inherit;
    &:focus {
      outline: #ABCF9F auto 3px;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    &:focus {
      outline: #ABCF9F auto 3px;
    }
  }

  a[disabled],
  button[disabled] {
    pointer-events: none;
  }

  ol,
  ul {
    list-style: none;
  }

  th {
    text-align: inherit;
  }

  html,
  body {
    width: 100%;
  }

  i, em {
    font-weight: 400;
  }

  body {
    background-color: ${color.background.base};
    color: ${color.text.dark.base};
    font-family: ${font.primary.family};
    font-weight: ${font.primary.weight.book};
    overflow-y: scroll;
    overflow-y: overlay; /* Prevent resizing on scroll lock in Webkit- and Blink-based browsers */
  }
`;

export default GlobalStyles;
