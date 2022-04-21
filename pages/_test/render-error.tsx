import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { FC } from "react";

interface PageProps {
  error: boolean;
}

const Page: FC<PageProps> = ({ error }) => {
  if (error) {
    throw new Error("Test rendering error");
  }

  return <Link href="/_test/render-error?error=true">Click me</Link>;
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  const props = { error: !!query.error };

  return { props };
};
