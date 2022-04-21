import { motion, useAnimation } from "framer-motion";
import React, { FC, useEffect } from "react";

import { ComponentStyleProps, percentage, s } from "@/common/ui/utils";

interface ProgressProps extends ComponentStyleProps {
  progress: number;
}

const Progress: FC<ProgressProps> = ({ _css = {}, progress }) => {
  const progressControls = useAnimation();

  useEffect(() => {
    progressControls.start({
      x: percentage(Math.max(0, Math.min(progress, 1))),
    });
  }, [progressControls, progress]);

  return (
    <div
      css={s(
        (t) => ({
          backgroundColor: t.color.background.feature3,
          borderRadius: t.radius.xxl,
          color: t.color.state.success,
          height: 10,
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }),
        _css
      )}
    >
      <motion.div
        animate={progressControls}
        css={s({
          backgroundColor: "currentColor",
          borderRadius: "inherit",
          height: "100%",
          position: "absolute",
          right: "100%",
          width: "100%",
        })}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default Progress;
