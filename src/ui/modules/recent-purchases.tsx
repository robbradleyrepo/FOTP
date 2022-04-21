import { useLazyQuery } from "@apollo/react-hooks";
import { useTimedLoop } from "@sss/hooks";
import { useLocale } from "@sss/i18n";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";

import { py, s, size } from "@/common/ui/utils";

import Icon from "../base/icon";
import { bodyTextSmall } from "../base/typography";
import cross from "../icons/cross";

const titleStyle = s(bodyTextSmall, (t) => ({
  fontWeight: t.font.primary.weight.medium,
  lineHeight: ["18px", null, "21px"],
}));

const bodyStyle = s(bodyTextSmall, {
  fontSize: [11, 12, 14],
  lineHeight: ["16px", "18px", "21px"],
});

interface RecentPurchase {
  city: string | null;
  id: string;
  name: string;
  province: string | null;
  when: string;
}

const RECENT_PURCHASES = gql`
  query RECENT_PURCHASES {
    payload: recentPurchases {
      city
      id
      name
      province
      when
    }
  }
`;

const enUsResource = {
  action: "Just purchased from Front Of The Pack!",
  close: "close",
  title: "{{ name }} from {{ location }}",
};

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const RecentPurchases = () => {
  const [dismissed, setDismissed] = useState(false);
  // As we're not loading this query in `getInitialProps`, it will end up running twice
  // if we're using `useQuery`. Instead we `useLazyQuery` and defer loading until the
  // client via the `useEffect`.
  const [loadData, { data }] = useLazyQuery<{ payload: RecentPurchase[] }>(
    RECENT_PURCHASES
  );
  useEffect(loadData, []);
  const item = useTimedLoop<RecentPurchase | undefined>(
    data?.payload ?? [],
    11000
  );

  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "recentPurchases", enUsResource);

  // Require at least a few recent purchases
  if (!item || dismissed || (data?.payload?.length ?? 0) < 4) {
    return null;
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        css={s((t) => ({
          backgroundColor: t.color.background.base,
          bottom: [8, 12, 16],
          boxShadow:
            "0px 3px 4px rgba(0, 0, 0, 0.15), 0px 0px 10px rgba(0, 0, 0, 0.25)",
          left: [8, 12, 16],
          maxWidth: [330, null, 360],
          minWidth: 250,
          paddingLeft: [t.spacing.sm, null, t.spacing.md],
          paddingRight: [t.spacing.md, null, t.spacing.lg],
          ...py([10, null, t.spacing.sm]),
          position: "fixed",
          // Behind the drawer
          zIndex: 99977,
        }))}
        key={item.id}
        animate={{
          opacity: 1,
          transition: { delay: 3, duration: 0.6 },
          x: 0,
        }}
        exit={{ opacity: 0, transition: { duration: 0.3 }, y: "100%" }}
        initial={{ opacity: 0, x: -320 }}
        transition={{ ease: "anticipate" }}
      >
        <p
          css={s(titleStyle)}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t("recentPurchases:title", {
            location: [
              toTitleCase(item?.city ?? ""),
              item.province?.toUpperCase(),
            ]
              .filter((v) => !!v)
              .join(", "),
            name: item.name,
          })}
        </p>
        <p css={s(bodyStyle)}>{t("recentPurchases:action")}</p>
        <p css={s(bodyStyle)}>{item.when}</p>
        <button
          css={s((t) => ({
            paddingBottom: t.spacing.lg,
            paddingLeft: t.spacing.lg,
            paddingRight: t.spacing.xs,
            paddingTop: t.spacing.xs,
            position: "absolute",
            right: 0,
            top: 0,
          }))}
          onClick={() => setDismissed(true)}
        >
          <Icon
            _css={s({ ...size(14), verticalAlign: "top" })}
            path={cross}
            title={t("recentPurchases:close")}
          />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecentPurchases;
