import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useRef } from "react";

import ANALYTICS from "../config";

export const GoogleOptimizeActivateEvents: FC = () => {
  const routeChanges = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = () => {
      // We do not trigger the activate on the first route change as we
      // pre-populate the data layer with an `optimize.activate` event.
      if (routeChanges.current > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer?.push({ event: "optimize.activate" });
      }

      routeChanges.current++;
    };

    router.events.on("routeChangeComplete", onRouteChange);

    return () => router.events.off("routeChangeComplete", onRouteChange);
  }, [router.events]);

  return null;
};

const GoogleOptimize: FC = () => {
  if (!ANALYTICS.integrations?.googleOptimize?.key) return null;

  return (
    <Head>
      <script
        key="google-optimize:activate"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({ event: "optimize.activate" });
          `,
        }}
      />
      <script
        async
        key="google-optimize:script"
        src={`https://www.googleoptimize.com/optimize.js?id=${ANALYTICS.integrations.googleOptimize.key}`}
      />
    </Head>
  );
};

export default GoogleOptimize;
