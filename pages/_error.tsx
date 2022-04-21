import { NextPage } from "next";
import { ErrorProps } from "next/error";
import React from "react";

import GenericError from "../src/pages/error/generic";

const Error: NextPage<ErrorProps> = () => <GenericError />;

// Docs still recommend getInitialProps for custom error page
// https://nextjs.org/docs/advanced-features/custom-error-page

Error.getInitialProps = async ({ err, res }) => {
  const statusCode = err?.statusCode || res?.statusCode || 500;

  // Make sure the response's status code matches the rendered one
  if (res) {
    res.statusCode = statusCode;
  }

  return { statusCode };
};

export default Error;
