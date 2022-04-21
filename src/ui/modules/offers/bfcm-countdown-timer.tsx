import { captureException } from "@sentry/nextjs";
import { useLocale } from "@sss/i18n";
import { zonedTimeToUtc } from "date-fns-tz";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import CountdownTimer from "./countdown-timer";

const enUsResource = {
  title: "Black Friday<br />Sale ends in",
};

const BfcmCountdownTimer: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { i18n, locale } = useLocale();

  i18n.addResourceBundle("en-US", "BfcmCountdownTimer", enUsResource);

  let clientTimezone: string | null = null;

  try {
    clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    captureException(error);
  }

  const bfEndDate = zonedTimeToUtc(
    new Date("November 29, 2021 00:00:00"),
    locale.timeZone
  );
  const cmEndDate = zonedTimeToUtc(
    new Date("November 30, 2021 00:00:00"),
    locale.timeZone
  );
  const now = clientTimezone && zonedTimeToUtc(new Date(), clientTimezone);

  return (
    <CountdownTimer
      _css={s({ backgroundColor: "black" }, _css)}
      convertToUtc={false}
      date={now && bfEndDate > now ? bfEndDate : cmEndDate}
    >
      <Trans i18nKey="BfcmCountdownTimer:title" />
    </CountdownTimer>
  );
};

export default BfcmCountdownTimer;
