module.exports = {
  plugins: [
    "date-fns",
    [
      "babel-plugin-graphql-tag",
      {
        strip: true,
      },
    ],
    "lodash",
    [
      "styled-components",
      {
        displayName: process.env.NODE_ENV !== "production",
        pure: true,
        ssr: true,
      },
    ],
    "transform-html-import-to-string",
    "transform-react-remove-prop-types",
  ],
  presets: ["@babel/preset-typescript", "next/babel"],
};
