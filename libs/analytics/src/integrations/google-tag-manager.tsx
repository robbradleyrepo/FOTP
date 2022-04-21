import Script from "next/script";
import React, { FC } from "react";

import config from "../config";

const GoogleTagManager: FC = () => {
  const gtmKey = config.integrations?.googleTagManager?.key;
  const gtmUrl =
    config.integrations?.googleTagManager?.proxyUrl ??
    "https://www.googletagmanager.com";

  return (
    <Script id="gtm">
      {gtmKey
        ? `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          '${gtmUrl}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmKey}');
          `
        : `
            window.dataLayer = window.dataLayer || [];
          `}
    </Script>
  );
};

export default GoogleTagManager;
