import { useInView } from "@sss/hooks";
import { motion, transform, useAnimation } from "framer-motion";
import React, { FC, ReactNode, useEffect } from "react";
import CountUp from "react-countup";

import { ComponentStyleProps, percentage, px, py, s } from "@/common/ui/utils";

import { bodyText, headingDelta } from "../../base/typography";

interface StockCounterProps extends ComponentStyleProps {
  content: {
    description: ReactNode;
    title: ReactNode;
  };
  duration?: {
    max: number;
    min: number;
  };
  to: number;
  from: number;
}

const fmtNumber = (value: number) => new Intl.NumberFormat().format(value);

const StockCounter: FC<StockCounterProps> = ({
  _css = {},
  content,
  from: fromCount,
  duration: { max: maxDuration = 3, min: minDuration = 1 } = {},
  to: toCount,
}) => {
  const durationSecs = transform(
    toCount / fromCount,
    [0, 1],
    [maxDuration, minDuration]
  );
  const countControls = useAnimation();

  const [ref, isInView] = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  useEffect(() => {
    const isUnSupported =
      !isInView && typeof window.IntersectionObserver === "undefined";
    if (isUnSupported || isInView) {
      countControls.start(
        {
          width: percentage(toCount / fromCount),
        },
        {
          duration: durationSecs,
        }
      );
    }
  }, [isInView]);

  return (
    <div
      css={s(_css, (t) => ({
        alignItems: "center",
        border: `1px solid ${t.color.background.dark}`,
        display: "flex",
        flexDirection: "column",
        ...px([t.spacing.sm, t.spacing.md, t.spacing.lg]),
        ...py(t.spacing.md),
      }))}
    >
      <div
        css={s(headingDelta, (t) => ({
          marginBottom: t.spacing.sm,
        }))}
      >
        {content.title}
      </div>
      <div
        css={s(bodyText, (t) => ({
          marginBottom: t.spacing.md,
        }))}
      >
        {content.description}
      </div>
      <div
        css={s((t) => ({
          backgroundColor: t.color.background.feature3,
          borderColor: t.color.background.feature3,
          borderRadius: 200,
          borderStyle: "solid",
          borderWidth: t.spacing.xxs,
          height: [36, null, 56],
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }))}
        ref={ref}
      >
        <motion.div
          animate={countControls}
          css={s((t) => ({
            backgroundColor: t.color.accent.light,
            height: "100%",
            width: "100%",
          }))}
        >
          <span
            css={s(bodyText, (t) => ({
              borderRadius: 100,
              color: t.color.text.dark.base,
              fontWeight: t.font.primary.weight.medium,
              position: "absolute",
              right: t.spacing.md,
              top: "50%",
              transform: "translateY(-50%)",
            }))}
          >
            {isInView ? (
              <CountUp
                delay={0}
                duration={durationSecs}
                end={toCount}
                separator=","
                suffix=" "
                start={fromCount}
              >
                {({ countUpRef }) => <span ref={countUpRef} />}
              </CountUp>
            ) : (
              `${fmtNumber(fromCount)} `
            )}
            / {fmtNumber(fromCount)}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default StockCounter;
