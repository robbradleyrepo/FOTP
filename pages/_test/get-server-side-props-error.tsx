import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";

import { makeServerSidePropsGetter } from "../_app";

const Page = () => (
  <Link href="/_test/get-server-side-props-error?error=true">Click me</Link>
);

export default Page;

export const getServerSideProps: GetServerSideProps = makeServerSidePropsGetter(
  async ({ query }) => {
    if (query.error) {
      throw new Error("getServerSideProps error");
    }

    return { props: {} };
  }
);
