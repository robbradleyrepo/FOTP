import { useLocale } from "@sss/i18n";
import { utcToZonedTime } from "date-fns-tz";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { bodyTextSmall } from "../base/typography";

const enUsResource = {
  cta: {
    call: "Call us:",
    email: "Email us:",
  },
  phone: "323-922-5737",
  questions: "Questions?",
};

const highlight = s(bodyTextSmall, (t) => ({
  display: "block",
  fontWeight: t.font.primary.weight.book,
}));

const motionProps = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  initial: { opacity: 0 },
};

const toMs = (hours: number, minutes = 0, ms = 0) =>
  (hours * 60 + minutes) * 1000 + ms;

const OPENING_MS = toMs(9); // 9am
const CLOSING_MS = toMs(17); // 5pm
const BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

const getIsBusinessHours = (tz: string): boolean => {
  const currentStoreDate = utcToZonedTime(new Date(), tz);

  if (!BUSINESS_DAYS.includes(currentStoreDate.getDay())) {
    return false;
  }

  const now = toMs(
    currentStoreDate.getHours(),
    currentStoreDate.getMinutes(),
    currentStoreDate.getMilliseconds()
  );

  return now >= OPENING_MS && now < CLOSING_MS;
};

const useIsBusinessHours = () => {
  const {
    locale: { timeZone },
  } = useLocale();

  // Default to `null` on the first render to avoid client/server mismatch
  const [isBusinessHours, setIsBusinessHours] = useState<boolean | null>(null);

  useEffect(() => {
    const timerId = setInterval(
      () => setIsBusinessHours(getIsBusinessHours(timeZone)),
      1000
    );

    return () => clearInterval(timerId);
  }, [timeZone]);

  return isBusinessHours;
};

const Contact: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, t } = useLocale();
  const isBusinessHours = useIsBusinessHours();

  i18n.addResourceBundle("en-US", "contact", enUsResource);

  const css = s(
    bodyTextSmall,
    {
      display: "block",
      fontSize: [12, null, 14],
      lineHeight: 1.4,
    },
    _css
  );

  return (
    <AnimatePresence>
      {isBusinessHours === true && (
        <motion.a
          key="contact"
          {...motionProps}
          css={css}
          href="tel:+13239225737"
        >
          {t("contact:questions")} {t("contact:cta.call")}
          <span css={highlight}>{t("contact:phone")}</span>
        </motion.a>
      )}
      {isBusinessHours === false && (
        <motion.a
          key="contact"
          {...motionProps}
          css={css}
          href={`mailto:${t("common:email")}`}
        >
          {t("contact:questions")} {t("contact:cta.email")}
          <span css={s(highlight, { textDecoration: "underline" })}>
            {t("common:email")}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default Contact;
