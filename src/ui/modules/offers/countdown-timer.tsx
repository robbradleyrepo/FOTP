import { useLocale } from "@sss/i18n";
import { zonedTimeToUtc } from "date-fns-tz";
import React, { FC, useEffect, useState } from "react";
import Countdown from "react-countdown";

import { belt, ComponentStyleProps, gutter, py, s } from "@/common/ui/utils";

import { headingAlpha, headingBravo, headingEcho } from "../../base/typography";
import { height } from "../../styles/variables";

const enUsResource = {
  title: "Sale ends in",
};

interface CountdownTimerProps extends ComponentStyleProps {
  convertToUtc?: boolean;
  date: Date;
}

const CountdownTimer: FC<CountdownTimerProps> = ({
  _css = {},
  children,
  convertToUtc = true,
  date,
}) => {
  const { i18n, locale, t } = useLocale();
  const [hasMounted, setHasMounted] = useState(false);

  i18n.addResourceBundle("en-US", "CountdownTimer", enUsResource);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? (
    <Countdown
      date={convertToUtc ? zonedTimeToUtc(date, locale.timeZone) : date}
      renderer={({
        completed,
        formatted: { days, hours, minutes, seconds },
      }) => {
        if (completed) {
          // Render a completed state
          return (
            <div
              css={s(
                {
                  marginTop: [height.nav.mobile, null, height.nav.desktop],
                },
                _css
              )}
            />
          );
        } else {
          // Render a countdown
          return (
            <div
              css={s(
                gutter,
                (t) => ({
                  ...py(t.spacing.md),
                  backgroundColor: t.color.background.dark,
                  color: t.color.text.light.base,
                  marginTop: [height.nav.mobile, null, height.nav.desktop],
                }),
                _css
              )}
            >
              <div
                css={s(belt, {
                  maxWidth: 1440,
                  position: "relative",
                })}
              >
                <div
                  css={s({
                    alignItems: "center",
                    display: ["block", null, "flex"],
                    height: [null, null, "100%"],
                    left: 0,
                    position: ["static", null, "absolute"],
                    top: 0,
                  })}
                >
                  <div
                    css={s(headingBravo, (t) => ({
                      marginBottom: [t.spacing.md, null, 0],
                      textAlign: "center",
                      transform: "skew(0, -10deg)",
                    }))}
                  >
                    {children || t("CountdownTimer:title")}
                  </div>
                </div>
                <div
                  css={s({
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0 auto",
                    maxWidth: 360,
                  })}
                >
                  <div
                    css={s(headingAlpha, {
                      minWidth: [48, null, 64],
                      textAlign: "center",
                    })}
                  >
                    {days}
                    <span
                      css={s(headingEcho, {
                        display: "block",
                        fontSize: 12,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      })}
                    >
                      days
                    </span>
                  </div>
                  <div css={s(headingAlpha)}>:</div>
                  <div
                    css={s(headingAlpha, {
                      minWidth: [48, null, 64],
                      textAlign: "center",
                    })}
                  >
                    {hours}
                    <span
                      css={s(headingEcho, {
                        display: "block",
                        fontSize: 12,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      })}
                    >
                      hrs
                    </span>
                  </div>
                  <div css={s(headingAlpha)}>:</div>
                  <div
                    css={s(headingAlpha, {
                      minWidth: [48, null, 64],
                      textAlign: "center",
                    })}
                  >
                    {minutes}
                    <span
                      css={s(headingEcho, {
                        display: "block",
                        fontSize: 12,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      })}
                    >
                      min
                    </span>
                  </div>
                  <div css={s(headingAlpha)}>:</div>
                  <div
                    css={s(headingAlpha, {
                      minWidth: [48, null, 64],
                      textAlign: "center",
                    })}
                  >
                    {seconds}
                    <span
                      css={s(headingEcho, {
                        display: "block",
                        fontSize: 12,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      })}
                    >
                      sec
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }}
    />
  ) : null;
};

export default CountdownTimer;
