import { useLocale } from "@sss/i18n";
import { getAsPath } from "@sss/next";
import { Metadata } from "@sss/seo";
import { useRouter } from "next/router";
import React, { FC } from "react";

import OG_IMG from "../assets/images/open-graph/logo-doggos.jpg";
import { SOCIAL } from "../config";

export const DefaultMetadata: FC = () => {
  const { t } = useLocale();
  const router = useRouter();

  // Next.js `asPath` might not always be the actual path on server side render.
  // We need to interpolate the params ourselves.
  // https://github.com/vercel/next.js/issues/17143
  const asPath = getAsPath(
    router.asPath.split("?").shift() ?? "",
    router.query,
    "discard"
  );
  const canonical = `${process.env.ORIGIN}${asPath}`;

  return (
    <Metadata
      canonical={canonical}
      facebook={{ appId: SOCIAL.facebook.appId }}
      openGraph={{
        image: OG_IMG.src,
        siteName: t("common:fotp"),
        type: "website",
        url: canonical,
      }}
      twitter={{
        cardType: "summary",
        site: SOCIAL.twitter.handle,
      }}
    />
  );
};
